const { formatPlace } = require('./schemaOrgTransformer');

const { getDbClient } = require("../toolbox/dbConnexion");

const tableName = "place";
const authorizedSort = ['name'];
const authorizedFilters = [];

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
          'slug', edition.slug,
          'name', edition.title,
          'number', edition.number,
          'startDate', edition.start_date_time,
          'disambiguatingDescription', edition.short_description,
          'category', edition_category.label
      ) ORDER BY edition.start_date_time DESC))
      FROM edition, edition_category
      WHERE edition.place_id = ${tableName}.id
      AND edition_category.id = edition.category_id) as events`)
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
 * Return paginated and filtered list of Places
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
      places: data.map(formatPlace),
      pagination,
    }));
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
      client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
          'slug', edition.slug,
          'name', edition.title,
          'number', edition.number,
          'startDate', edition.start_date_time,
          'disambiguatingDescription', edition.short_description,
          'category', edition_category.label
      ) ORDER BY edition.start_date_time DESC))
      FROM edition, edition_category
      WHERE edition.place_id = ${tableName}.id
      AND edition_category.id = edition.category_id) as events`)
    )
    .from(tableName)
    .where({ [`${tableName}.slug`]: slug })
    .then(formatPlace);
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
