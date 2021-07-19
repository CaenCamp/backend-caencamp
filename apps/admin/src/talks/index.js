import React from "react";
import PropTypes from "prop-types";
import TalkIcon from '@material-ui/icons/Slideshow';
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
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

const TalkFilters = (props) => (
  <Filter {...props}>
    <TextInput source="title" alwaysOn />
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

const TalkPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const TalkList = (props) => {
  return (
    <List
      {...props}
      filters={<TalkFilters />}
      filterDefaultValues={{}}
      sort={{ field: "name", order: "ASC" }}
      exporter={false}
      pagination={<TalkPagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="title" sortable={true} />
        <TextField source="shortDescription" sortable={false} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const TalkTitle = ({ record }) =>
  record ? `Talk "${record.title}"` : null;

export const TalkEdit = (props) => (
  <Edit title={<TalkTitle />} {...props}>
    <TabbedForm>
      <FormTab label="Content">
        <TextInput fullWidth source="title" validate={required()} />
        <TextInput
          fullWidth
          source="shortDescription"
          label="Description rapide"
          validate={required()}
        />
        <ReferenceInput label="Type" source="typeId" reference="talk-types">
          <SelectInput optionText="label" />
        </ReferenceInput>
        <ReferenceArrayInput source="tagsId" reference="tags">
          <SelectArrayInput optionText="label" />
        </ReferenceArrayInput>
      </FormTab>
      <FormTab label="Supports">
        <p>Les slides, repo, videos, ...</p>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export const TalkCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput fullWidth source="title" validate={required()} />
      <ReferenceInput label="Type" source="typeId" reference="talk-types">
          <SelectInput optionText="label" />
        </ReferenceInput>
      <TextInput
          fullWidth
          source="shortDescription"
          label="Description rapide"
          validate={required()}
        />
    </SimpleForm>
  </Create>
);

const talks = {
  icon: TalkIcon,
  list: TalkList,
  edit: TalkEdit,
  create: TalkCreate,
};

export default talks;
