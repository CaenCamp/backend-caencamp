exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE edition_category ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE edition ADD COLUMN category_uuid uuid;
        UPDATE edition SET category_uuid = edition_category.uuid FROM edition_category WHERE edition.category_id = edition_category.id;
        ALTER TABLE edition ALTER COLUMN category_uuid SET NOT NULL;
        ALTER TABLE edition DROP COLUMN category_id;
        ALTER TABLE edition RENAME COLUMN category_uuid TO category_id;
        CREATE INDEX IF NOT EXISTS idx_category_id ON edition(category_id);

        ALTER TABLE edition_category DROP COLUMN id;
        ALTER TABLE edition_category RENAME COLUMN uuid TO id;
        ALTER TABLE edition_category ADD PRIMARY KEY (id);

        ALTER TABLE edition ALTER COLUMN category_id DROP NOT NULL;
        ALTER TABLE edition 
            ADD CONSTRAINT category_id_foreign 
            FOREIGN KEY(category_id) 
            REFERENCES edition_category(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
