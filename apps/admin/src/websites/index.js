import React from 'react';
import WebSiteIcon from '@material-ui/icons/Language';
import {
  Datagrid,
  Create,
  Edit,
  EditButton,
  List,
  Pagination,
  SimpleForm,
  TextField,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  useEditController,
} from 'react-admin';
import { useLocation } from 'react-router';

const WebSitePagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const WebSiteList = (props) => {
  return (
    <List
      {...props}
      sort={{ field: 'label', order: 'ASC' }}
      exporter={false}
      pagination={<WebSitePagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="url" sortable={true} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const WebSiteTitle = ({ record }) => (record ? `Site "${record.url}"` : null);

export const WebSiteEdit = (props) => {
  const { record } = useEditController(props);
  const redirect = record ? `/speakers/${record.speakerId}/1` : false ;

  return (
    <Edit title={<WebSiteTitle />} {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput fullWidth source="url" validate={required()} />
        <ReferenceInput label="Type" source="typeId" reference="website-types">
          <SelectInput optionText="label" validate={required()} />
        </ReferenceInput>
        <ReferenceInput label="Speaker" source="speakerId" reference="speakers">
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

export const WebSiteCreate = (props) => {
  const location = useLocation();
  console.log(location)
  const speakerId =
    location.state && location.state.record
      ? location.state.record.speakerId
      : undefined;

  const redirect = speakerId ? `/speakers/${speakerId}/1` : false;

  return (
    <Create {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput fullWidth source="url" validate={required()} />
        <ReferenceInput label="Type" source="typeId" reference="website-types">
          <SelectInput optionText="label" validate={required()} />
        </ReferenceInput>
        <ReferenceInput label="Speaker" source="speakerId" reference="speakers">
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

const webSites = {
  icon: WebSiteIcon,
  list: WebSiteList,
  edit: WebSiteEdit,
  create: WebSiteCreate,
};

export default webSites;
