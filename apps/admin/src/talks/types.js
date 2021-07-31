import React from 'react';
import TalkTypeIcon from '@material-ui/icons/Label';
import {
  Datagrid,
  Create,
  Edit,
  EditButton,
  List,
  NumberInput,
  Pagination,
  SimpleForm,
  TextField,
  TextInput,
  required,
} from 'react-admin';

const TalkTypePagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const TalkTypeList = (props) => {
  return (
    <List
      {...props}
      sort={{ field: 'label', order: 'ASC' }}
      exporter={false}
      pagination={<TalkTypePagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="label" sortable={true} />
        <TextField source="description" sortable={false} />
        <TextField source="durationInMinutes" sortable={false} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const TalkTypeTitle = ({ record }) => (record ? `TalkType "${record.name}"` : null);

export const TalkTypeEdit = (props) => (
  <Edit title={<TalkTypeTitle />} {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
        <TextInput fullWidth source="description" validate={required()} />
        <NumberInput fullWidth source="durationInMinutes" validate={required()} />
    </SimpleForm>
  </Edit>
);

export const TalkTypeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
        <TextInput fullWidth source="description" validate={required()} />
        <NumberInput fullWidth source="durationInMinutes" validate={required()} />
    </SimpleForm>
  </Create>
);

const talkTypes = {
  icon: TalkTypeIcon,
  list: TalkTypeList,
  edit: TalkTypeEdit,
  create: TalkTypeCreate,
};

export default talkTypes;
