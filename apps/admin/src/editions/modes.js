import React from "react";
import EditionModeIcon from '@material-ui/icons/DeveloperMode';
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


const EditionModePagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const EditionModeFilters = (props) => (
    <Filter {...props}>
      <TextInput source="label" alwaysOn />
    </Filter>
  );

const EditionModeList = (props) => {
  return (
    <List
      {...props}
      filters={<EditionModeFilters />}
      filterDefaultValues={{}}
      sort={{ field: "label", order: "ASC" }}
      exporter={false}
      pagination={<EditionModePagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="label" sortable={true} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const EditionModeTitle = ({ record }) => (record ? `EditionMode "${record.name}"` : null);

export const EditionModeEdit = (props) => (
  <Edit title={<EditionModeTitle />} {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
    </SimpleForm>
  </Edit>
);

export const EditionModeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
    </SimpleForm>
  </Create>
);

const editionModes = {
  icon: EditionModeIcon,
  list: EditionModeList,
  edit: EditionModeEdit,
  create: EditionModeCreate,
};

export default editionModes;
