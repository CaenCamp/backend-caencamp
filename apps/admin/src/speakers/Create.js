import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  TopToolbar,
} from "react-admin";
import { Breadcrumb, ResourceBreadcrumbItems } from "../components/menu";
import { MarkdownInput, caenCampOptions } from '../components/inputs/MarkdownInput';

const SpeakerBreadcrumb = (props) => (
  <Breadcrumb {...props}>
    <ResourceBreadcrumbItems />
  </Breadcrumb>
);

const SpeakerActions = () => (
  <TopToolbar>
    <Breadcrumb variant="actions" />
  </TopToolbar>
);


export const SpeakerCreate = (props) => (
  <>
    <SpeakerBreadcrumb />
    <Create actions={<SpeakerActions />} {...props}>
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
  </>
);

export default SpeakerCreate;
