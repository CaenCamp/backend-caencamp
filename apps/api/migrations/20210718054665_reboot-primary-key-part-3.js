exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE talk_type ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE talk ADD COLUMN type_uuid uuid;
        UPDATE talk SET type_uuid = talk_type.uuid FROM talk_type WHERE talk.type_id = talk_type.id;
        ALTER TABLE talk ALTER COLUMN type_uuid SET NOT NULL;
        ALTER TABLE talk DROP COLUMN type_id;
        ALTER TABLE talk RENAME COLUMN type_uuid TO type_id;
        CREATE INDEX IF NOT EXISTS idx_type_id ON talk(type_id);

        ALTER TABLE talk_type DROP COLUMN id;
        ALTER TABLE talk_type RENAME COLUMN uuid TO id;
        ALTER TABLE talk_type ADD PRIMARY KEY (id);

        ALTER TABLE talk ALTER COLUMN type_id DROP NOT NULL;
        ALTER TABLE talk 
            ADD CONSTRAINT talk_type_id_foreign 
            FOREIGN KEY(type_id) 
            REFERENCES talk_type(id)
            ON DELETE SET NULL;
    `);
};

exports.down = function () {
    return true
};
