const { formatJobPosting } = require('./schemaOrgTransformer');
const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'job_posting';
const authorizedSort = [
    'datePosted',
    'title',
    'jobStartDate',
    'validThrough',
    'employmentType',
    'organization.postal_code',
];
const authorizedFilters = [
    'title',
    'skills',
    'employmentType',
    'datePosted',
    'jobStartDate',
    'validThrough',
    'organization.name',
    'organization.address_locality',
    'organization.postal_code',
];

/**
 * Knex query for filtrated jobPosting list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client) => {
    return client
        .select(
            `${tableName}.*`,
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.logo as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl',
        )
        .from(tableName)
        .join('organization', {
            'organization.id': `${tableName}.hiring_organization_id`,
        });
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
        hiringOrganizationPostalCode: 'organization.postal_code',
        hiringOrganizationName: 'organization.name',
        hiringOrganizationAddressLocality: 'organization.address_locality',
    };

    return Object.keys(queryParameters).reduce((acc, filter) => {
        if (filter === 'sortBy') {
            const sortName = Object.prototype.hasOwnProperty.call(filterNamesToChange, queryParameters.sortBy)
                ? filterNamesToChange[queryParameters.sortBy]
                : queryParameters.sortBy;

            return {
                ...acc,
                sortBy: sortName,
            };
        }

        const filterName = Object.prototype.hasOwnProperty.call(filterNamesToChange, filter)
            ? filterNamesToChange[filter]
            : filter;

        return {
            ...acc,
            [filterName]: queryParameters[filter],
        };
    }, {});
};

/**
 * Return paginated and filtered list of jobPosting
 *
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated jobPosting list and pagination
 */
const getPaginatedList = async (queryParameters) => {
    const client = getDbClient();
    return getFilteredJobPostingsQuery(client)
        .paginateRestList({
            queryParameters: renameFiltersFromAPI(queryParameters),
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            jobPostings: data.map(formatJobPosting),
            pagination,
        }));
};

/**
 * Knex query for single jobPosting
 *
 * @param {string} jobPostingId - jobPosting Id
 * @returns {Promise} - Knew query for single jobPosting
 */
const getOneByIdQuery = (client, id) => {
    return client
        .first(
            `${tableName}.*`,
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.logo as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl',
        )
        .from(tableName)
        .join('organization', {
            'organization.id': `${tableName}.hiring_organization_id`,
        })
        .where({ [`${tableName}.id`]: id });
};

/**
 * Return a jobPosting
 *
 * @param {object} organizationId - The jobPosting identifier
 * @returns {Promise} - the jobPosting
 */
const getOne = async (id) => {
    const client = getDbClient();
    return getOneByIdQuery(client, id)
        .then(formatJobPosting)
        .catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getPaginatedList,
};
