exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE web_site_type ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE web_site ADD COLUMN type_uuid uuid;
        UPDATE web_site SET type_uuid = web_site_type.uuid FROM web_site_type WHERE web_site.type_id = web_site_type.id;
        ALTER TABLE web_site ALTER COLUMN type_uuid SET NOT NULL;
        ALTER TABLE web_site DROP COLUMN type_id;
        ALTER TABLE web_site RENAME COLUMN type_uuid TO type_id;
        CREATE INDEX idx_type_id ON web_site(type_id);

        ALTER TABLE web_site_type DROP COLUMN id;
        ALTER TABLE web_site_type RENAME COLUMN uuid TO id;
        ALTER TABLE web_site_type ADD PRIMARY KEY (id);

        ALTER TABLE web_site ALTER COLUMN type_id DROP NOT NULL;
        ALTER TABLE web_site 
            ADD CONSTRAINT web_site_type_id_foreign 
            FOREIGN KEY(type_id) 
            REFERENCES web_site_type(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
