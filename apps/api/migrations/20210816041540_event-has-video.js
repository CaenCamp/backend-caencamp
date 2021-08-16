exports.up = function (knex) {
    return knex.schema.table('edition', (table) => {
        table.boolean('has_video').notNullable().defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.table('edition', (table) => {
        table.dropColumn('has_video');
    });
};
