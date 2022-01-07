exports.up = function (knex) {
    return knex.schema.createTable('call_for_paper', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 300).notNullable();
        table.string('title', 300).notNullable();
        table.text('description').notNullable();
        table.text('contact', 150).notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.string('status', 20).notNullable().defaultTo('submitted');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('call_for_paper');
};
