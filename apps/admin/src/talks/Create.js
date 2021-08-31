import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import {
  MarkdownInput,
  caenCampOptions,
} from '../components/inputs/MarkdownInput';

const TalkCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput fullWidth source="title" validate={required()} />
      <ReferenceInput label="Type" source="typeId" reference="talk-types">
        <SelectInput optionText="label" />
      </ReferenceInput>
      <ReferenceArrayInput source="speakers" reference="speakers" perPage={100}>
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="tags" reference="tags" perPage={100}>
        <SelectArrayInput optionText="label" />
      </ReferenceArrayInput>
      <TextInput
        fullWidth
        source="shortDescription"
        label="Description rapide"
        validate={required()}
        multiline
      />
      <MarkdownInput
        source="descriptionMarkdown"
        label="Description complète"
        validate={required()}
        options={caenCampOptions}
      />
    </SimpleForm>
  </Create>
);

export default TalkCreate;
