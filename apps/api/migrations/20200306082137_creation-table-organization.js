exports.up = function (knex) {
    return knex.schema
        .createTable('contact_point', function (table) {
            table
                .uuid('id')
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.integer('organization_id');
            table
                .foreign('organization_id')
                .references('organization.id')
                .onDelete('CASCADE');
            table.string('email', 150).notNullable();
            table.string('telephone', 30).nullable();
            table.string('name', 300).notNullable();
            table.string('contact_type', 150).nullable();
            table.unique(['organization_id', 'email']);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('contact_point');
};
