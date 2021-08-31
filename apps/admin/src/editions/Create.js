import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  NumberInput,
  BooleanInput,
} from 'react-admin';
import {
  MarkdownInput,
  caenCampOptions,
} from '../components/inputs/MarkdownInput';

export const EditionCreate = (props) => (
  <Create {...props} title="Création d'une edition">
    <SimpleForm>
      <TextInput fullWidth label="titre" source="title" validate={required()} />
      <NumberInput label="numero" source="number" validate={required()} />
      <ReferenceInput
        label="Categorie"
        source="categoryId"
        reference="edition-categories"
      >
        <SelectInput optionText="label" validate={required()}/>
      </ReferenceInput>
      <ReferenceInput label="Mode" source="modeId" reference="edition-modes">
        <SelectInput optionText="label" validate={required()}/>
      </ReferenceInput>
      <ReferenceInput label="Organisateur" source="organizerId" reference="organizations">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <ReferenceInput label="Lieu" source="placeId" reference="places">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <DateTimeInput source="startDateTime" Label="Date et heure de début" validate={required()}/>
      <DateTimeInput source="endDateTime" Label="Date et heure de fin" />
      <BooleanInput source="published" Label="Publié ?" />
      <TextInput
        fullWidth
        multiline
        label="Résumé"
        source="shortDescription"
        validate={required()}
      />
      <MarkdownInput
        source="descriptionMarkdown"
        label="Description"
        validate={required()}
        options={caenCampOptions}
      />
      <TextInput fullWidth label="Meetup" source="meetupId" />
    </SimpleForm>
  </Create>
);
