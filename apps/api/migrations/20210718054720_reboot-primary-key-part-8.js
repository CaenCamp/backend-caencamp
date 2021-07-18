exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE place ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE edition ADD COLUMN place_uuid uuid;
        UPDATE edition SET place_uuid = place.uuid FROM place WHERE edition.place_id = place.id;
        ALTER TABLE edition ALTER COLUMN place_uuid SET NOT NULL;
        ALTER TABLE edition DROP COLUMN place_id;
        ALTER TABLE edition RENAME COLUMN place_uuid TO place_id;
        CREATE INDEX IF NOT EXISTS idx_place_id ON edition(place_id);

        ALTER TABLE place DROP COLUMN id;
        ALTER TABLE place RENAME COLUMN uuid TO id;
        ALTER TABLE place ADD PRIMARY KEY (id);

        ALTER TABLE edition ALTER COLUMN place_id DROP NOT NULL;
        ALTER TABLE edition 
            ADD CONSTRAINT place_id_foreign 
            FOREIGN KEY(place_id) 
            REFERENCES place(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
