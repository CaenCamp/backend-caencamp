const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'edition';

const authorizedSort = [
    'number',
    'start_date_time',
];

const authorizedFilters = [
    'edition_category.label',
    'number',
    'start_date_time',
    'edition_tag.tag',
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
        .select(
            `${tableName}.*`,
            client.raw(`array_agg(DISTINCT edition_tag.tag ) as tags`),
        )
        .from(tableName)
        .innerJoin('edition_tag', {
            'edition_tag.edition_id': `${tableName}.id`,
        })
        .join('edition_category', {
            'edition_category.id': `${tableName}.category_id`,
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
        category: 'edition_category.label',
        tag: 'edition_tag.tag',
    };

    return Object.keys(queryParameters).reduce((acc, filter) => {
        if (filter === 'sortBy') {
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

        if (filter === 'when') {
            const now = new Date();
            switch (queryParameters.when) {
                case 'upcomming':
                    return {
                        ...acc,
                        'start_date_time': `${now.toDateString()}:gte`,
                    };
                case 'past':
                    return {
                        ...acc,
                        'start_date_time': `${now.toDateString()}:lt`,
                    };
                default: // all so no filter
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
        .then(({ data, pagination }) => ({
            editions: data,
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
    return getOneByIdQuery(client, id)
        .catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getPaginatedList,
    renameFiltersFromAPI,
};
