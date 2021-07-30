import React from "react";
import {
  Edit,
  TextInput,
  TabbedForm,
  FormTab,
  required,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  NumberInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";
import {
    MarkdownInput,
    caenCampOptions,
  } from "../components/inputs/MarkdownInput";

const EditionTitle = ({ record }) =>
  record ? `Edition ${record.title}` : null;

export const EditionEdit = (props) => {
  return (
    <Edit title={<EditionTitle />} {...props}>
      <TabbedForm>
        <FormTab label="L'edition">
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
            <DateTimeInput source="startDateTime" Label="Date et heure de début" validate={required()}/>
            <DateTimeInput source="endDateTime" Label="Date et heure de fin" />
            <TextInput
                fullWidth
                multiline
                label="Résumé"
                source="shortDescription"
                validate={required()}
                multiline
            />
            <MarkdownInput
                source="descriptionMarkdown"
                label="Description"
                validate={required()}
                options={caenCampOptions}
            />
            <TextInput fullWidth label="Meetup" source="meetupId" />
        </FormTab>
        <FormTab label="Le lieux">
            <ReferenceInput label="Lieu" source="placeId" reference="places">
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </FormTab>
        <FormTab label="Les talks">
            <ReferenceArrayInput source="talks" reference="talks" perPage={100}>
                <SelectArrayInput optionText="title" />
            </ReferenceArrayInput>
        </FormTab>
        <FormTab label="Les sponsors">
            <ReferenceInput label="Sponsor" source="sponsorId" reference="organizations">
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
