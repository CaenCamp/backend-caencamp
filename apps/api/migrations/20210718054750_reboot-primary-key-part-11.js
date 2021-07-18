exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE job_posting 
            ADD CONSTRAINT hiring_organization_id_foreign 
            FOREIGN KEY(hiring_organization_id) 
            REFERENCES organization(id)
            ON DELETE CASCADE;
    `);
};

exports.down = function () {
    return true
};
