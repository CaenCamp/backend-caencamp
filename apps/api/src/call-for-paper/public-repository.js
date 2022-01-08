const { formatPlace } = require('./schemaOrgTransformer');

const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'call_for_paper';

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
 * Return the created Oject
 *
 * @param {object} apiData - The validated data sent from API to create a new Oject
 * @returns {Promise} - the created Oject
 */
const createOne = async (apiData) => {
    const client = getDbClient();

    return client(tableName)
        .returning('id')
        .insert(apiData)
        .then(([wsId]) => {
            return getOneByIdQuery(client, wsId);
        })
        .catch((error) => ({ error }));
};

module.exports = {
    createOne,
};
