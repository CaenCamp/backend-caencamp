exports.up = function (knex) {
    return knex.schema.table('organization', (table) => {
        table.string('email', 150).nullable();
        table.string('address_country', 5).notNullable().defaultTo('FR');
        table.string('address_locality', 150).notNullable().defaultTo('Caen');
        table.string('postal_code', 20).notNullable().defaultTo('14000');
        table.string('street_address', 300);
    });
};

exports.down = function (knex) {
    return knex.schema.table('organization', (table) => {
        table.dropColumn('email');
        table.dropColumn('address_country');
        table.dropColumn('address_locality');
        table.dropColumn('postal_code');
        table.dropColumn('street_address');
    });
};
