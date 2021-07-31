import React from 'react';
import {
  Edit,
  TextInput,
  required,
  TabbedForm,
  FormTab,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  TopToolbar,
} from 'react-admin';

import { Breadcrumb, ResourceBreadcrumbItems } from '../components/menu';
import {
  MarkdownInput,
  caenCampOptions,
} from '../components/inputs/MarkdownInput';

const TalkBreadcrumb = (props) => (
  <Breadcrumb {...props}>
    <ResourceBreadcrumbItems />
  </Breadcrumb>
);

const TalkActions = () => (
  <TopToolbar>
    <Breadcrumb variant="actions" />
  </TopToolbar>
);

const TalkTitle = ({ record }) => (record ? `Talk "${record.title}"` : null);

const TalkEdit = (props) => (
  <>
    <TalkBreadcrumb />
    <Edit title={<TalkTitle />} actions={<TalkActions />} {...props}>
      <TabbedForm>
        <FormTab label="Content">
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
        </FormTab>
        <FormTab label="Supports">
          <p>Les slides, repo, videos, ...</p>
        </FormTab>
      </TabbedForm>
    </Edit>
  </>
);

export default TalkEdit;
