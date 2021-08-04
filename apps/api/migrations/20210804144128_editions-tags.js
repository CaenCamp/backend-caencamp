exports.up = function (knex) {
    return knex.schema.createTable('edition_tag', function (table) {
        table.uuid('edition_id').notNullable();
        table
            .foreign('edition_id')
            .references('edition.id')
            .onDelete('CASCADE');
        table.string('tag').notNullable();
        table
            .foreign('tag')
            .references('tag.slug')
            .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('edition_tag');
};
