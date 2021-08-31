import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';
import { MarkdownInput, caenCampOptions } from '../components/inputs/MarkdownInput';

export const SpeakerCreate = (props) => (
    <Create {...props}>
      <SimpleForm>
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
      </SimpleForm>
    </Create>
);

export default SpeakerCreate;
