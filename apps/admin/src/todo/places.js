import React from "react";
import PropTypes from "prop-types";
import PlaceIcon from "@material-ui/icons/Place";
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
} from "react-admin";

const PlaceFilters = (props) => (
  <Filter {...props}>
    <TextInput source="name" alwaysOn />
  </Filter>
);

const WebsiteField = ({ record = {} }) => {
  if (!record.url) return <span>Pas de site renseigné.</span>;

  return (
    <a href={record.url} target="_blank" rel="noreferrer">
      Site web
    </a>
  );
};

WebsiteField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const Address = ({ record = {} }) => {
  const completeAddress = [ record.address1, record.address2].filter(a => a);
  return (
    <p>{completeAddress.join(', ')}<br />{record.postalCode} {record.city}</p>
  )
}

Address.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const EditionField = ({ record = {} }) => <span>{record.editions.length}</span>;

EditionField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const PlacePagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25]} {...props} />
);

const PlaceList = (props) => {
  return (
    <List
      {...props}
      filters={<PlaceFilters />}
      filterDefaultValues={{}}
      sort={{ field: "name", order: "ASC" }}
      exporter={false}
      pagination={<PlacePagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="name" sortable={true} />
        <WebsiteField source="url" sortable={false} />
        <Address source="postal_code" sortable={true} label="Address"/>
        <EditionField source="editions" sortable={false} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const PlaceTitle = ({ record }) => (record ? `Place "${record.name}"` : null);

export const PlaceEdit = (props) => (
  <Edit title={<PlaceTitle />} {...props}>
    <TabbedForm>
      <FormTab label="Content">
        <TextInput fullWidth source="name" validate={required()} />
        <TextInput
          fullWidth
          source="description"
          multiline
          validate={required()}
        />
        <TextInput fullWidth source="url" label="Web site" />
      </FormTab>
      <FormTab label="Address">
        <TextInput fullWidth source="address1" validate={required()} />
        <TextInput fullWidth source="address2" />
        <TextInput fullWidth source="postalCode" validate={required()} />
        <TextInput fullWidth source="city" validate={required()} />
        <TextInput fullWidth source="country" validate={required()} disabled/>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export const PlaceCreate = (props) => (
  <Create {...props}>
    <SimpleForm initialValues={{ country: 'FR' }}>
      <TextInput fullWidth source="name" validate={required()} />
      <TextInput fullWidth source="address1" validate={required()} />
      <TextInput fullWidth source="address2" />
      <TextInput fullWidth source="postalCode" validate={required()} />
      <TextInput fullWidth source="city" validate={required()} />
      <TextInput fullWidth source="country" validate={required()} disabled/>
      <TextInput
          fullWidth
          source="description"
          multiline
          validate={required()}
        />
      <TextInput fullWidth source="url" label="Web site" />
    </SimpleForm>
  </Create>
);

const places = {
  icon: PlaceIcon,
  list: PlaceList,
  edit: PlaceEdit,
  create: PlaceCreate,
};

export default places;
