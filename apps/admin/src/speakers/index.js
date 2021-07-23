import React from "react";
import PropTypes from "prop-types";
import SpeakerIcon from '@material-ui/icons/RecordVoiceOver';
import {
  Datagrid,
  Create,
  Edit,
  EditButton,
  Filter,
  List,
  Pagination,
  SimpleForm,
  TextField,
  TextInput,
  required,
  TabbedForm,
  FormTab,
  TopToolbar,
  ReferenceManyField,
} from "react-admin";

import { MarkdownInput, caenCampOptions } from '../components/inputs/MarkdownInput';
import { Breadcrumb, ResourceBreadcrumbItems } from "../components/menu";

const SpeakerBreadcrumb = (props) => (
  <Breadcrumb {...props}>
    <ResourceBreadcrumbItems />
  </Breadcrumb>
);

const SpeakerFilters = (props) => (
  <Filter {...props}>
    <TextInput source="name" alwaysOn />
  </Filter>
);

const WebsitesField = ({ record = {} }) => (
  <span>{record.websites.length}</span>
);

WebsitesField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const TalksField = ({ record = {} }) => <span>{record.talks.length}</span>;

TalksField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const SpeakerPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const SpeakerList = (props) => {
  return (
    <List
      {...props}
      filters={<SpeakerFilters />}
      filterDefaultValues={{}}
      sort={{ field: "name", order: "ASC" }}
      exporter={false}
      pagination={<SpeakerPagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="name" sortable={true} />
        <TextField source="shortBiography" sortable={false} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const SpeakerTitle = ({ record }) =>
  record ? `Speaker "${record.name}"` : null;

const SpeakerActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <Breadcrumb variant="actions" />
  </TopToolbar>
);

export const SpeakerEdit = (props) => (
  <>
    <SpeakerBreadcrumb />
    <Edit actions={<SpeakerActions />} title={<SpeakerTitle />} {...props}>
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
            sort={{ field: "typeId", order: "DESC" }}
          >
            <Datagrid>
              <TextField source="url" />
              <TextField source="typId" />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
        <FormTab label="Les talks">
          <p>Simple liste des talks avec lien d'édition</p>
        </FormTab>
      </TabbedForm>
    </Edit>
  </>
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
        <TextInput
          fullWidth
          source="biography"
          label="Bio complète"
          multiline
          validate={required()}
        />
      </SimpleForm>
    </Create>
  </>
);

const speakers = {
  icon: SpeakerIcon,
  list: SpeakerList,
  edit: SpeakerEdit,
  create: SpeakerCreate,
};

export default speakers;
