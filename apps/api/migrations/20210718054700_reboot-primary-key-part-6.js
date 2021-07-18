exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE edition_mode ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE edition ADD COLUMN mode_uuid uuid;
        UPDATE edition SET mode_uuid = edition_mode.uuid FROM edition_mode WHERE edition.mode_id = edition_mode.id;
        ALTER TABLE edition ALTER COLUMN mode_uuid SET NOT NULL;
        ALTER TABLE edition DROP COLUMN mode_id;
        ALTER TABLE edition RENAME COLUMN mode_uuid TO mode_id;
        CREATE INDEX IF NOT EXISTS idx_mode_id ON edition(mode_id);

        ALTER TABLE edition_mode DROP COLUMN id;
        ALTER TABLE edition_mode RENAME COLUMN uuid TO id;
        ALTER TABLE edition_mode ADD PRIMARY KEY (id);

        ALTER TABLE edition ALTER COLUMN mode_id DROP NOT NULL;
        ALTER TABLE edition 
            ADD CONSTRAINT mode_id_foreign 
            FOREIGN KEY(mode_id) 
            REFERENCES edition_mode(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
