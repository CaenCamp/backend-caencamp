exports.up = function (knex) {
    return knex.schema.createTable('job_posting', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title', 300).notNullable();
        table.string('url', 400).nullable();
        table.date('date_posted').notNullable();
        table.text('employer_overview').notNullable();
        table.enu('employment_type', ['CDI', 'CDD', 'Alternance', 'Autre']).notNullable();
        table.text('experience_requirements').notNullable();
        table.date('job_start_date').nullable();
        table.string('skills').notNullable();
        table.date('valid_through').nullable();
        table.integer('hiring_organization_id');
        table.foreign('hiring_organization_id').references('organization.id').onDelete('CASCADE');
        table.jsonb('base_salary').nullable();
        table
            .enum('job_location_type', ['office', 'remote', 'remote and office', 'remote or office'])
            .notNullable()
            .defaultTo('office');
        table.boolean('job_immediate_start').defaultTo(false);
        table.boolean('published').defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('job_posting');
};
