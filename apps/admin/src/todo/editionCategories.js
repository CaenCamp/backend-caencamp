import React from "react";
import EditionCategoryIcon from '@material-ui/icons/Category';
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


const EditionCategoryPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const EditionCategoryFilters = (props) => (
    <Filter {...props}>
      <TextInput source="label" alwaysOn />
    </Filter>
  );

const EditionCategoryList = (props) => {
  return (
    <List
      {...props}
      filters={<EditionCategoryFilters />}
      filterDefaultValues={{}}
      sort={{ field: "label", order: "ASC" }}
      exporter={false}
      pagination={<EditionCategoryPagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="label" sortable={true} />
        <TextField source="description" sortable={false} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const EditionCategoryTitle = ({ record }) => (record ? `EditionCategory "${record.name}"` : null);

export const EditionCategoryEdit = (props) => (
  <Edit title={<EditionCategoryTitle />} {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
        <TextInput fullWidth source="description" validate={required()} />
    </SimpleForm>
  </Edit>
);

export const EditionCategoryCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
        <TextInput fullWidth source="description" validate={required()} />
    </SimpleForm>
  </Create>
);

const editionCategories = {
  icon: EditionCategoryIcon,
  list: EditionCategoryList,
  edit: EditionCategoryEdit,
  create: EditionCategoryCreate,
};

export default editionCategories;
