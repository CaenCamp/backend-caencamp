exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE tag ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE talk_tag ADD COLUMN tag_uuid uuid;
        UPDATE talk_tag SET tag_uuid = tag.uuid FROM tag WHERE talk_tag.tag_id = tag.id;
        ALTER TABLE talk_tag ALTER COLUMN tag_uuid SET NOT NULL;
        ALTER TABLE talk_tag DROP COLUMN tag_id;
        ALTER TABLE talk_tag RENAME COLUMN tag_uuid TO tag_id;
        CREATE INDEX IF NOT EXISTS idx_tag_id ON talk_tag(tag_id);

        ALTER TABLE tag DROP COLUMN id;
        ALTER TABLE tag RENAME COLUMN uuid TO id;
        ALTER TABLE tag ADD PRIMARY KEY (id);

        ALTER TABLE talk_tag 
            ADD CONSTRAINT tag_id_foreign 
            FOREIGN KEY(tag_id) 
            REFERENCES tag(id)
            ON DELETE CASCADE;
    `);
};

exports.down = function () {
    return true
};
