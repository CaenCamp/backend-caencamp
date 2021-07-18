exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE web_site ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;
        ALTER TABLE web_site DROP COLUMN id;
        ALTER TABLE web_site RENAME COLUMN uuid TO id;
        ALTER TABLE web_site ADD PRIMARY KEY (id);

        ALTER TABLE speaker ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;

        ALTER TABLE web_site ADD COLUMN speaker_uuid uuid;
        UPDATE web_site SET speaker_uuid = speaker.uuid FROM speaker WHERE web_site.speaker_id = speaker.id;
        ALTER TABLE web_site ALTER COLUMN speaker_uuid SET NOT NULL;
        ALTER TABLE web_site DROP COLUMN speaker_id;
        ALTER TABLE web_site RENAME COLUMN speaker_uuid TO speaker_id;
        CREATE INDEX IF NOT EXISTS idx_speaker_id ON web_site(speaker_id);

        ALTER TABLE talk_speaker ADD COLUMN speaker_uuid uuid;
        UPDATE talk_speaker SET speaker_uuid = speaker.uuid FROM speaker WHERE talk_speaker.speaker_id = speaker.id;
        ALTER TABLE talk_speaker ALTER COLUMN speaker_uuid SET NOT NULL;
        ALTER TABLE talk_speaker DROP COLUMN speaker_id;
        ALTER TABLE talk_speaker RENAME COLUMN speaker_uuid TO speaker_id;
        CREATE INDEX IF NOT EXISTS idx_speaker_id ON talk_speaker(speaker_id);

        ALTER TABLE speaker DROP COLUMN id;
        ALTER TABLE speaker RENAME COLUMN uuid TO id;
        ALTER TABLE speaker ADD PRIMARY KEY (id);

        ALTER TABLE web_site 
            ADD CONSTRAINT web_site_speaker_id_foreign 
            FOREIGN KEY(speaker_id) 
            REFERENCES speaker(id)
            ON DELETE CASCADE;

        ALTER TABLE talk_speaker 
            ADD CONSTRAINT talk_speaker_speaker_id_foreign 
            FOREIGN KEY(speaker_id) 
            REFERENCES speaker(id)
            ON DELETE CASCADE;
    `);
};

exports.down = function () {
    return true
};
