exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE organization ADD COLUMN uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL;

        ALTER TABLE edition ADD COLUMN organizer_uuid uuid;
        UPDATE edition SET organizer_uuid = organization.uuid FROM organization WHERE edition.organizer_id = organization.id;
        ALTER TABLE edition ALTER COLUMN organizer_uuid SET NOT NULL;
        ALTER TABLE edition DROP COLUMN organizer_id;
        ALTER TABLE edition RENAME COLUMN organizer_uuid TO organizer_id;
        CREATE INDEX IF NOT EXISTS idx_organizer_id ON edition(organizer_id);

        ALTER TABLE edition ADD COLUMN sponsor_uuid uuid;
        UPDATE edition SET sponsor_uuid = organization.uuid FROM organization WHERE edition.sponsor_id = organization.id;
        ALTER TABLE edition DROP COLUMN sponsor_id;
        ALTER TABLE edition RENAME COLUMN sponsor_uuid TO sponsor_id;
        CREATE INDEX IF NOT EXISTS idx_sponsor_id ON edition(sponsor_id);

        ALTER TABLE contact_point ADD COLUMN organization_uuid uuid;
        UPDATE contact_point SET organization_uuid = organization.uuid FROM organization WHERE contact_point.organization_id = organization.id;
        ALTER TABLE contact_point ALTER COLUMN organization_uuid SET NOT NULL;
        ALTER TABLE contact_point DROP COLUMN organization_id;
        ALTER TABLE contact_point RENAME COLUMN organization_uuid TO organization_id;
        CREATE INDEX IF NOT EXISTS idx_organization_id ON contact_point(organization_id);

        ALTER TABLE job_posting ADD COLUMN hiring_organization_uuid uuid;
        UPDATE job_posting SET hiring_organization_uuid = organization.uuid FROM organization WHERE job_posting.hiring_organization_id = organization.id;
        ALTER TABLE job_posting ALTER COLUMN hiring_organization_uuid SET NOT NULL;
        ALTER TABLE job_posting DROP COLUMN hiring_organization_id;
        ALTER TABLE job_posting RENAME COLUMN hiring_organization_uuid TO hiring_organization_id;
        CREATE INDEX IF NOT EXISTS idx_hiring_organization_id ON job_posting(hiring_organization_id);

        ALTER TABLE organization DROP COLUMN id;
        ALTER TABLE organization RENAME COLUMN uuid TO id;
        ALTER TABLE organization ADD PRIMARY KEY (id);

        ALTER TABLE edition ALTER COLUMN organizer_id DROP NOT NULL;
        ALTER TABLE edition 
            ADD CONSTRAINT organizer_id_foreign 
            FOREIGN KEY(organizer_id) 
            REFERENCES organization(id)
            ON DELETE SET NULL;

        ALTER TABLE edition 
            ADD CONSTRAINT sponsor_id_foreign 
            FOREIGN KEY(sponsor_id) 
            REFERENCES organization(id)
            ON DELETE SET NULL;

        ALTER TABLE contact_point 
            ADD CONSTRAINT organization_id_foreign 
            FOREIGN KEY(organization_id) 
            REFERENCES organization(id)
            ON DELETE CASCADE;
    `);
};

exports.down = function () {
    return true
};
