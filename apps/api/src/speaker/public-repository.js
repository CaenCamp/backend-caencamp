const { getDbClient } = require('../toolbox/dbConnexion');
const { formatSpeaker } = require('./schemaOrgTransformer');

const tableName = "speaker";
const authorizedSort = [
  'name',
];
const authorizedFilters = [
  'name',
];

/**
 * Knex query for filtrated Oject list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated Oject list
 */
const getFilteredQuery = (client) => {
  return client.select(
        `${tableName}.*`,
        client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
            'type', web_site_type.label,
            'url', web_site.url
        ) ORDER BY web_site_type.label))
        FROM web_site, web_site_type
        WHERE web_site.speaker_id = ${tableName}.id
        AND web_site.type_id = web_site_type.id) as websites`),
        client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
            'slug', talk.slug,
            'title', talk.title,
            'type', talk_type.label,
            'durationInMinutes', talk_type.duration_in_minutes,
            'shortDescription', talk.short_description,
            'video', talk.video,
            'edition', edition.slug
        ) ORDER BY edition.start_date_time DESC))
        FROM talk_speaker, talk, talk_type, edition
        WHERE talk_speaker.speaker_id = ${tableName}.id
        AND talk_speaker.talk_id = talk.id
        AND talk.edition_id = edition.id
        AND talk_type.id = talk.type_id) as talks`)
    ).from(tableName);
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
  const filterNamesToChange = {};

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
    .then(({ data, pagination }) => ({
      speakers: data.map(formatSpeaker),
      pagination,
    }));
};

/**
 * Knex query for single Object
 *
 * @param {string} ObjectId - Object Slug
 * @returns {Promise} - Knew query for single Object
 */
const getOneBySlugQuery = (client, slug) => {
  return client
    .first(
        `${tableName}.*`,
        client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
            'type', web_site_type.label,
            'url', web_site.url
        ) ORDER BY web_site_type.label))
        FROM web_site, web_site_type
        WHERE web_site.speaker_id = ${tableName}.id
        AND web_site.type_id = web_site_type.id) as websites`),
        client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
            'slug', talk.slug,
            'title', talk.title,
            'type', talk_type.label,
            'durationInMinutes', talk_type.duration_in_minutes,
            'shortDescription', talk.short_description,
            'video', talk.video,
            'edition', edition.slug
        ) ORDER BY edition.start_date_time DESC))
        FROM talk_speaker, talk, talk_type, edition
        WHERE talk_speaker.speaker_id = ${tableName}.id
        AND talk_speaker.talk_id = talk.id
        AND talk.edition_id = edition.id
        AND talk_type.id = talk.type_id) as talks`)
    )
    .from(tableName)
    .where({ [`${tableName}.slug`]: slug })
    .then(formatSpeaker);
};

/**
 * Return a Object
 *
 * @param {object} slug - The Object identifier
 * @returns {Promise} - the Object
 */
const getOne = async (slug) => {
  const client = getDbClient();
  return getOneBySlugQuery(client, slug).catch((error) => ({ error }));
};

module.exports = {
  getOne,
  getPaginatedList,
};
