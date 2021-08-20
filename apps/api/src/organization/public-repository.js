const { getDbClient } = require('../toolbox/dbConnexion');
const { formatOrganization } = require('./schemaOrgTransformer');

const tableName = 'organization';
const authorizedFilters = ['name', 'addressLocality', 'postalCode'];
const authorizedSort = ['name', 'addressLocality', 'postalCode'];

/**
 * Knex query for filtrated organization list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated organization list
 */
const getFilteredOrganizationsQuery = (client) => {
    return client
        .select(
            `${tableName}.*`,
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'identifier',
                contact_point.id,
                'email',
                contact_point.email,
                'telephone',
                contact_point.telephone,
                'name',
                contact_point.name,
                'contactType',
                contact_point.contact_type
            ) ORDER BY contact_point.contact_type))
            FROM contact_point WHERE contact_point.organization_id = ${tableName}.id) as contact_points`),
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'slug', edition.slug,
                'name', edition.title,
                'number', edition.number,
                'startDate', edition.start_date_time,
                'disambiguatingDescription', edition.short_description,
                'category', edition_category.label
            ) ORDER BY edition.start_date_time DESC))
            FROM edition, edition_category
            WHERE edition.sponsor_id = ${tableName}.id
            AND edition_category.id = edition.category_id) as events`)
        )
        .from(tableName);
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
            organizations: data.map(formatOrganization),
            pagination,
        }));
};

/**
 * Knex query for single organization
 *
 * @param {object} client - The Database client
 * @param {string} organizationSlug - Organization slug
 * @returns {Promise} - Knew query for single organization
 */
const getOneBySlugQuery = (client, organizationSlug) => {
    return client
        .table(tableName)
        .first(
            `${tableName}.*`,
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'identifier',
                contact_point.id,
                'email',
                contact_point.email,
                'telephone',
                contact_point.telephone,
                'name',
                contact_point.name,
                'contactType',
                contact_point.contact_type
            ) ORDER BY contact_point.contact_type))
            FROM contact_point WHERE contact_point.organization_id = ${tableName}.id) as contact_points`),
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'slug', edition.slug,
                'name', edition.title,
                'number', edition.number,
                'startDate', edition.start_date_time,
                'disambiguatingDescription', edition.short_description,
                'category', edition_category.label
            ) ORDER BY edition.start_date_time DESC))
            FROM edition, edition_category
            WHERE edition.sponsor_id = ${tableName}.id
            AND edition_category.id = edition.category_id) as events`)
        )
        .where({ slug: organizationSlug });
};

/**
 * Return an organization
 *
 * @param {object} organizationSlug - The organization identifier
 * @returns {Promise} - the organization
 */
const getOne = async (organizationSlug) => {
    const client = getDbClient();
    return getOneBySlugQuery(client, organizationSlug)
        .then(formatOrganization)
        .catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getPaginatedList,
};
