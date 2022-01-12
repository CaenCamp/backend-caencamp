exports.up = async function (knex) {
    await knex.schema.createTable('code_naf', function (table) {
        table.string('code', 30).primary().notNullable();
        table.string('label', 500).notNullable();
        table.string('id_1', 30).notNullable();
        table.string('label_1', 500).notNullable();
        table.string('id_2', 30).notNullable();
        table.string('label_2', 500).notNullable();
        table.string('id_3', 30).notNullable();
        table.string('label_3', 500).notNullable();
        table.string('id_4', 30).notNullable();
        table.string('label_4', 500).notNullable();
        table.string('id_5', 30).notNullable();
        table.string('label_5', 500).notNullable();
    });

    await knex.schema.createTable('staffing', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('label', 500).notNullable();
    });

    await knex.schema.createTable('legal_structure', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('label', 500).notNullable();
    });

    return knex.schema.createTable('imported_organization', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 300).notNullable();
        table.string('slug', 300).notNullable();
        table.text('description', 300).notNullable();
        table.string('url', 300).nullable();
        table.string('address_country', 10).notNullable().defaultTo('FR');
        table.string('address_locality', 300).nullable();
        table.string('postal_code', 300).nullable();
        table.string('street_address', 300).nullable();
        table.dateTime('creation_date').nullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.string('imported_from', 100).notNullable();
        table.string('code_naf', 30).nullable();
        table.foreign('code_naf').references('code_naf.code').onDelete('SET NULL');
        table.uuid('staffing_id').nullable();
        table.foreign('staffing_id').references('staffing.id').onDelete('SET NULL');
        table.uuid('legal_structure_id').nullable();
        table.foreign('legal_structure_id').references('legal_structure.id').onDelete('SET NULL');
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable('code_naf');
    await knex.schema.dropTable('staffing');
    await knex.schema.dropTable('legal_structure');
    return knex.schema.dropTable('imported_organization');
};
