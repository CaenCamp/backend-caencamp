exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE talk ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;

        ALTER TABLE talk_tag ADD COLUMN talk_uuid uuid;
        UPDATE talk_tag SET talk_uuid = talk.uuid FROM talk WHERE talk_tag.talk_id = talk.id;
        ALTER TABLE talk_tag ALTER COLUMN talk_uuid SET NOT NULL;
        ALTER TABLE talk_tag DROP COLUMN talk_id;
        ALTER TABLE talk_tag RENAME COLUMN talk_uuid TO talk_id;
        CREATE INDEX IF NOT EXISTS idx_talk_id ON talk_tag(talk_id);

        ALTER TABLE talk_speaker ADD COLUMN talk_uuid uuid;
        UPDATE talk_speaker SET talk_uuid = talk.uuid FROM talk WHERE talk_speaker.talk_id = talk.id;
        ALTER TABLE talk_speaker ALTER COLUMN talk_uuid SET NOT NULL;
        ALTER TABLE talk_speaker DROP COLUMN talk_id;
        ALTER TABLE talk_speaker RENAME COLUMN talk_uuid TO talk_id;
        CREATE INDEX IF NOT EXISTS idx_talk_id ON talk_speaker(talk_id);

        ALTER TABLE talk DROP COLUMN id;
        ALTER TABLE talk RENAME COLUMN uuid TO id;
        ALTER TABLE talk ADD PRIMARY KEY (id);

        ALTER TABLE talk_tag 
            ADD CONSTRAINT talk_tag_talk_id_foreign 
            FOREIGN KEY(talk_id) 
            REFERENCES talk(id)
            ON DELETE CASCADE;

        ALTER TABLE talk_speaker 
            ADD CONSTRAINT talk_speaker_talk_id_foreign 
            FOREIGN KEY(talk_id) 
            REFERENCES talk(id)
            ON DELETE CASCADE;
    `);
};

exports.down = function () {
    return true
};
