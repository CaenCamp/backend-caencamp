exports.up = function (knex) {
    return knex.schema.createTable('post_token', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('owner', 200).notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('last_use_at');
        table.unique('owner');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('post_token');
};
