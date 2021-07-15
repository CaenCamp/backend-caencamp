exports.up = async function (knex) {
    await knex.raw(`CREATE extension IF NOT EXISTS "uuid-ossp"`);
    return knex.schema.dropTable('admin').dropTable('doctrine_migration_versions');
};

exports.down = function () {
    return true;
};
