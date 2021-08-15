const { formatEvent } = require('./schemaOrgTransformer');
const { getDbClient } = require("../toolbox/dbConnexion");

const tableName = "edition";

const authorizedSort = ["number", "start_date_time"];

const authorizedFilters = [
  "edition_category.label",
  "number",
  "start_date_time",
  "edition_tag.tag",
  "published",
];

/**
 * Knex query for filtrated Oject list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated Oject list
 */
const getFilteredQuery = (client) => {
  return client
    .distinct(`${tableName}.id`)
    .select(`${tableName}.*`)
    .from(tableName)
    .innerJoin("edition_tag", {
      "edition_tag.edition_id": `${tableName}.id`,
    })
    .join("edition_category", {
      "edition_category.id": `${tableName}.category_id`,
    })
    .groupBy(`${tableName}.id`); 
};

/**
 * Return queryParameters with name as real row db name
 *
 * It is not always possible to name the applicable filters from the API
 * with a name compatible with SQL tables. This is especially true when operating JOINs.
 * This method allows to transform the name of a filter that can be used from the API into a name compatible
 * with the PostgreSQL tables
 *
 * @param {Object} queryParameters
 * @return {Object} Query parameters renamed as db row name
 */
const renameFiltersFromAPI = (queryParameters) => {
  const filterNamesToChange = {
    category: "edition_category.label",
    tag: "edition_tag.tag",
  };

  return Object.keys(queryParameters).reduce((acc, filter) => {
    if (filter === "sortBy") {
      const sortName = Object.prototype.hasOwnProperty.call(
        filterNamesToChange,
        queryParameters.sortBy
      )
        ? filterNamesToChange[queryParameters.sortBy]
        : queryParameters.sortBy;

      return {
        ...acc,
        sortBy: sortName,
      };
    }

    if (filter === "when") {
      const now = new Date();
      switch (queryParameters.when) {
        case "upcomming":
          return {
            ...acc,
            start_date_time: `${now.toDateString()}:gte`,
          };
        case "past":
          return {
            ...acc,
            start_date_time: `${now.toDateString()}:lt`,
          };
        default:
          // all so no filter
          return acc;
      }
    }

    const filterName = Object.prototype.hasOwnProperty.call(
      filterNamesToChange,
      filter
    )
      ? filterNamesToChange[filter]
      : filter;

    return {
      ...acc,
      [filterName]: queryParameters[filter],
    };
  }, {});
};

/**
 * Return paginated and filtered list of WebSite
 *
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated WebSite list and pagination
 */
const getPaginatedList = async (queryParameters) => {
  const client = getDbClient();
  return getFilteredQuery(client)
    .paginateRestList({
      queryParameters: renameFiltersFromAPI(queryParameters),
      authorizedFilters,
      authorizedSort,
    })
    .then(async ({ data, pagination }) => {
        const editions = await client
            .select(
                `${tableName}.*`,
                "edition_category.label as category",
                "edition_mode.label as mode",
                "place.address1",
                "place.address2",
                "place.postal_code",
                "place.city",
                "place.country",
                "place.name as place",
                "place.slug as place_slug",
                client.raw(`(SELECT jsonb_build_object(
                        'identifier', organization.slug,
                        'name', organization.name
                    )
                    FROM organization WHERE organization.id = ${tableName}.organizer_id) as organizer`),
                client.raw(`(SELECT jsonb_build_object(
                        'identifier',organization.slug,
                        'name', organization.name
                    )
                    FROM organization WHERE organization.id = ${tableName}.sponsor_id) as sponsor`),
                client.raw(`(SELECT ARRAY(
                        SELECT et.tag
                        FROM edition_tag et
                        WHERE  et.edition_id = ${tableName}.id
                    ) as tags)`),
                client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                        'slug', talk.slug,
                        'title', talk.title,
                        'description', talk.description,
                        'descriptionHtml', talk.description_html,
                        'shortDescription', talk.short_description,
                        'speakers', (
                            SELECT array_to_json(array_agg(jsonb_build_object(
                                'slug', speaker.slug,
                                'name', speaker.name,
                                'shortBiography', speaker.short_biography
                            ) ORDER BY speaker.name))
                            FROM talk_speaker, speaker
                            WHERE talk_speaker.talk_id = talk.id
                            AND talk_speaker.speaker_id = speaker.id
                        ),
                        'format', (
                          SELECT jsonb_build_object(
                              'label', talk_type.label,
                              'durationInMinute', talk_type.duration_in_minutes
                          )
                          FROM talk_type, talk
                          WHERE talk_speaker.id = talk.type_id
                        )
                    ) ORDER BY talk.title))
                    FROM talk WHERE talk.edition_id = ${tableName}.id) as talks`)
            )
            .from(tableName)
            .join("edition_category", {
                "edition_category.id": `${tableName}.category_id`,
            })
            .join("edition_mode", {
                "edition_mode.id": `${tableName}.mode_id`,
            })
            .join("place", {
                "place.id": `${tableName}.place_id`,
            })
            .where({ published: true })
            .whereIn(`${tableName}.id`, data.map(e => e.id))
            .orderBy('number', 'desc')
            .then(e => e.map(formatEvent));

        return {
            editions,
            pagination,
        };
    });
};

/**
 * Knex query for single Object
 *
 * @param {string} ObjectId - Object Id
 * @returns {Promise} - Knew query for single Object
 */
const getOneBySlugQuery = (client, slug) => {
    return client
        .first(
            `${tableName}.*`,
            "edition_category.label as category",
            "edition_mode.label as mode",
            "place.address1",
            "place.address2",
            "place.postal_code",
            "place.city",
            "place.country",
            "place.name as place",
            "place.slug as place_slug",
            client.raw(`(SELECT jsonb_build_object(
                    'identifier', organization.slug,
                    'name', organization.name
                )
                FROM organization WHERE organization.id = ${tableName}.organizer_id) as organizer`),
            client.raw(`(SELECT jsonb_build_object(
                    'identifier',organization.slug,
                    'name', organization.name
                )
                FROM organization WHERE organization.id = ${tableName}.sponsor_id) as sponsor`),
            client.raw(`(SELECT ARRAY(
                    SELECT et.tag
                    FROM edition_tag et
                    WHERE  et.edition_id = ${tableName}.id
                ) as tags)`),
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                    'slug', talk.slug,
                    'title', talk.title,
                    'type', talk_type.label,
                    'durationInMinutes', talk_type.duration_in_minutes,
                    'description', talk.description,
                    'descriptionHtml', talk.description_html,
                    'shortDescription', talk.short_description,
                    'speakers', (
                        SELECT array_to_json(array_agg(jsonb_build_object(
                            'slug', speaker.slug,
                            'name', speaker.name,
                            'shortBiography', speaker.short_biography
                        ) ORDER BY speaker.name))
                        FROM talk_speaker, speaker
                        WHERE talk_speaker.talk_id = talk.id
                        AND talk_speaker.speaker_id = speaker.id
                    )
                ) ORDER BY talk.title))
                FROM talk, talk_type
                WHERE talk.edition_id = ${tableName}.id
                AND talk_type.id = talk.type_id) as talks`)
        )
        .from(tableName)
        .join("edition_category", {
        "edition_category.id": `${tableName}.category_id`,
        })
        .join("edition_mode", {
        "edition_mode.id": `${tableName}.mode_id`,
        })
        .join("place", {
        "place.id": `${tableName}.place_id`,
        })
        .where({ [`${tableName}.slug`]: slug, published: true });
};

/**
 * Return a Object
 *
 * @param {object} organizationId - The Object identifier
 * @returns {Promise} - the Object
 */
const getOne = async (slug) => {
  const client = getDbClient();
  return getOneBySlugQuery(client, slug)
    .then(formatEvent)
    .catch((error) => ({ error }));
};

module.exports = {
  getOne,
  getPaginatedList,
};
