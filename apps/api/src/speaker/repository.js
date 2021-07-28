const omit = require("lodash.omit");
const slugify = require('slugify');
const { markdownToTxt } = require('markdown-to-txt');
const marked  = require("marked");

const { getDbClient } = require("../toolbox/dbConnexion");

const slugConfig = {
  replacement: "-", // replace spaces with replacement character, defaults to `-`
  remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  strict: true, // strip special characters except replacement, defaults to `false`
  locale: 'fr', // language code of the locale to use
  trim: true, // trim leading and trailing replacement chars, defaults to `true`
};

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
        client.raw(`(SELECT ARRAY(
          SELECT ts.talk_id
          FROM talk_speaker ts
          WHERE  ts.speaker_id = ${tableName}.id
        ) as talks)`),
        client.raw(`(SELECT ARRAY(
          SELECT ws.id
          FROM web_site ws
          WHERE  ws.speaker_id = ${tableName}.id
        ) as websites)`),
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
      speakers: data,
      pagination,
    }));
};

/**
 * Knex query for single Object
 *
 * @param {string} ObjectId - Object Id
 * @returns {Promise} - Knew query for single Object
 */
const getOneByIdQuery = (client, id) => {
  return client
    .first(
        `${tableName}.*`,
        client.raw(`(SELECT ARRAY(
          SELECT ts.talk_id
          FROM talk_speaker ts
          WHERE  ts.speaker_id = ${tableName}.id
        ) as talks)`),
        client.raw(`(SELECT ARRAY(
          SELECT ws.id
          FROM web_site ws
          WHERE  ws.speaker_id = ${tableName}.id
        ) as websites)`),
    )
    .from(tableName)
    .where({ [`${tableName}.id`]: id });
};

/**
 * Return a Object
 *
 * @param {object} organizationId - The Object identifier
 * @returns {Promise} - the Object
 */
const getOne = async (id) => {
  const client = getDbClient();
  return getOneByIdQuery(client, id).catch((error) => ({ error }));
};

/**
 * Return the created Oject
 *
 * @param {object} apiData - The validated data sent from API to create a new Oject
 * @returns {Promise} - the created Oject
 */
const createOne = async (apiData) => {
  const client = getDbClient();

  return client(tableName)
    .returning("id")
    .insert({
      ...omit(apiData, ['talks', 'websites']),
      slug: slugify(apiData.name, slugConfig),
      biographyHtml: marked(apiData.biographyMarkdown),
      biography: markdownToTxt(apiData.biographyMarkdown),
    })
    .then(([wsId]) => {
      return getOneByIdQuery(client, wsId);
    })
    .catch((error) => ({ error }));
};

/**
 * Delete a Object
 *
 * @param {object} ObjectId - The Object identifier
 * @returns {Promise} - the id of the deleted Object or an empty object if Object is not in db
 */
const deleteOne = async (id) => {
  const client = getDbClient();
  return client(tableName)
    .where({ id })
    .del()
    .then((nbDeletion) => {
      return nbDeletion ? { id } : {};
    })
    .catch((error) => ({ error }));
};

/**
 * Update a Object
 *
 * @param {object} ObjectId - The Object identifier
 * @param {object} apiData - The validated data sent from API to update the Object
 * @returns {Promise} - the updated Object
 */
const updateOne = async (id, apiData) => {
  const client = getDbClient();
  // check that jobPosting exist
  const currentObject = await client.first("id").from(tableName).where({ id });
  if (!currentObject) {
    return {};
  }

  const dataForUpdate = {
    ...omit(apiData, ['talks', 'websites']),
    slug: slugify(apiData.name, slugConfig),
    biographyHtml: marked(apiData.biographyMarkdown),
    biography: markdownToTxt(apiData.biographyMarkdown),
  };

  // update the Oject
  const updatedObject = await client(tableName)
    .where({ id })
    .update(dataForUpdate)
    .catch((error) => ({ error }));
  if (updatedObject.error) {
    return updatedObject;
  }

  // return the complete Object from db
  return getOneByIdQuery(client, id).catch((error) => ({ error }));
};

module.exports = {
  createOne,
  deleteOne,
  getOne,
  getPaginatedList,
  renameFiltersFromAPI,
  updateOne,
};
