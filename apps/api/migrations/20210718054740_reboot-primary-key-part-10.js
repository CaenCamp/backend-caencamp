exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE edition ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;

        ALTER TABLE talk ADD COLUMN edition_uuid uuid;
        UPDATE talk SET edition_uuid = edition.uuid FROM edition WHERE talk.edition_id = edition.id;
        ALTER TABLE talk ALTER COLUMN edition_uuid SET NOT NULL;
        ALTER TABLE talk DROP COLUMN edition_id;
        ALTER TABLE talk RENAME COLUMN edition_uuid TO edition_id;
        CREATE INDEX IF NOT EXISTS idx_edition_id ON talk(edition_id);

        ALTER TABLE edition DROP COLUMN id;
        ALTER TABLE edition RENAME COLUMN uuid TO id;
        ALTER TABLE edition ADD PRIMARY KEY (id);

        ALTER TABLE talk ALTER COLUMN edition_id DROP NOT NULL;
        ALTER TABLE talk 
            ADD CONSTRAINT edition_id_foreign 
            FOREIGN KEY(edition_id) 
            REFERENCES edition(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
