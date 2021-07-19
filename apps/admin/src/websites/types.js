import React from "react";
import WebSiteTypeIcon from '@material-ui/icons/Language';
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
} from "react-admin";


const WebSiteTypePagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const WebSiteTypeFilters = (props) => (
    <Filter {...props}>
      <TextInput source="label" alwaysOn />
    </Filter>
  );

const WebSiteTypeList = (props) => {
  return (
    <List
      {...props}
      filters={<WebSiteTypeFilters />}
      filterDefaultValues={{}}
      sort={{ field: "label", order: "ASC" }}
      exporter={false}
      pagination={<WebSiteTypePagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="label" sortable={true} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const WebSiteTypeTitle = ({ record }) => (record ? `Type de site "${record.name}"` : null);

export const WebSiteTypeEdit = (props) => (
  <Edit title={<WebSiteTypeTitle />} {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
    </SimpleForm>
  </Edit>
);

export const WebSiteTypeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
    </SimpleForm>
  </Create>
);

const webSiteTypes = {
  icon: WebSiteTypeIcon,
  list: WebSiteTypeList,
  edit: WebSiteTypeEdit,
  create: WebSiteTypeCreate,
};

export default webSiteTypes;
