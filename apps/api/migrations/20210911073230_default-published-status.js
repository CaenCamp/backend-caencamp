exports.up = function (knex) {
    return knex.schema.alterTable('edition', (table) => {
        table.boolean('published').notNullable().defaultTo(false).alter();
    });
};

exports.down = function () {
    return true;
};
