import React from 'react';
import {
  Datagrid,
  Edit,
  EditButton,
  TextField,
  TextInput,
  required,
  TabbedForm,
  FormTab,
  ReferenceManyField,
  ReferenceField,
} from 'react-admin';

import {
  MarkdownInput,
  caenCampOptions,
} from '../components/inputs/MarkdownInput';
import { AddNewWebsiteButton } from './index';

const SpeakerTitle = ({ record }) =>
  record ? `Speaker "${record.name}"` : null;

export const SpeakerEdit = (props) => (
  <Edit title={<SpeakerTitle />} {...props}>
    <TabbedForm>
      <FormTab label="Content">
        <TextInput fullWidth source="name" validate={required()} />
        <TextInput
          fullWidth
          source="shortBiography"
          label="Bio rapide"
          validate={required()}
        />
        <MarkdownInput
          source="biographyMarkdown"
          label="Bio complète"
          validate={required()}
          options={caenCampOptions}
        />
      </FormTab>
      <FormTab label="Sites web">
        <ReferenceManyField
          addLabel={false}
          reference="websites"
          target="speakerId"
          sort={{ field: 'typeId', order: 'DESC' }}
        >
          <Datagrid>
            <TextField source="url" />
            <ReferenceField
              label="Type"
              source="typeId"
              reference="website-types"
            >
              <TextField source="label" />
            </ReferenceField>
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
        <AddNewWebsiteButton />
      </FormTab>
      <FormTab label="Les talks">
        <p>Simple liste des talks avec lien d'édition</p>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default SpeakerEdit;
