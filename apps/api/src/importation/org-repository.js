const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'imported_organization';
const authorizedFilters = ['name', 'addressLocality', 'postalCode', 'codeNafId', 'staffingId', 'legalStructureId'];
const authorizedSort = [
    'name',
    'id',
    'addressLocality',
    'postalCode',
    'creationDate',
    'codeNafId',
    'staffingId',
    'legalStructureId',
];

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
            queryParameters,
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            organizations: data,
            pagination,
        }));
};

/**
 * Knex query for single organization
 *
 * @param {object} client - The Database client
 * @param {string} organizationId - Organization Id
 * @returns {Promise} - Knew query for single organization
 */
const getOneByIdQuery = (client, organizationId) => {
    return client.table(tableName).first(`${tableName}.*`).where({ id: organizationId });
};

/**
 * Return an organization
 *
 * @param {object} organizationId - The organization identifier
 * @returns {Promise} - the organization
 */
const getOne = async (organizationId) => {
    const client = getDbClient();
    return getOneByIdQuery(client, organizationId).catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getPaginatedList,
};
