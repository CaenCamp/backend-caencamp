const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'staffing';
const authorizedFilters = ['id', 'label'];
const authorizedSort = ['id', 'label'];

/**
 * Knex query for filtrated organization list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated organization list
 */
const getFilteredOrganizationsQuery = (client) => {
    return client.select(`${tableName}.*`).from(tableName);
};

/**
 * Return paginated and filtered list of organization
 *
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated organization list and pagination
 */
const getPaginatedList = async (queryParameters) => {
    const client = getDbClient();
    return getFilteredOrganizationsQuery(client)
        .paginateRestList({
            queryParameters: { ...queryParameters, perPage: 100 },
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            staffings: data,
            pagination,
        }));
};

/**
 * Knex query for single organization
 *
 * @param {object} client - The Database client
 * @param {string} code - code naf
 * @returns {Promise} - Knew query for single code naf
 */
const getOneByIdQuery = (client, id) => {
    return client.table(tableName).first(`${tableName}.*`).where({ id });
};

/**
 * Return an code naf
 *
 * @param {object} id - The code naf identifier
 * @returns {Promise} - the code naf
 */
const getOne = async (id) => {
    const client = getDbClient();
    return getOneByIdQuery(client, id).catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getPaginatedList,
};
