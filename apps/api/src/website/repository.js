const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'web_site';
const authorizedSort = ['typeId', 'speakerId', 'url'];
const authorizedFilters = ['typeId', 'speakerId'];

/**
 * Knex query for filtrated Oject list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated Oject list
 */
const getFilteredQuery = (client) => {
    return client.select('*').from(tableName);
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
            queryParameters,
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            websites: data,
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
        .first('*')
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

    const speaker = await client.first('id').from('speaker').where({ id: apiData.speakerId });

    if (!speaker) {
        return { error: new Error('this speaker does not exist') };
    }

    const type = await client.first('id').from('web_site_type').where({ id: apiData.typeId });

    if (!type) {
        return { error: new Error('this type does not exist') };
    }

    return client(tableName)
        .returning('id')
        .insert(apiData)
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
    const currentObject = await client.first('id').from(tableName).where({ id });
    if (!currentObject) {
        return {};
    }

    // update the Oject
    const updatedObject = await client(tableName)
        .where({ id })
        .update(apiData)
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
    updateOne,
};
