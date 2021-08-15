import React from 'react';
import TagIcon from '@material-ui/icons/Loyalty';
import {
  Datagrid,
  Create,
  Edit,
  EditButton,
  Filter,
  List,
  NumberField,
  Pagination,
  SimpleForm,
  TextField,
  TextInput,
  required,
  ChipField,
  ReferenceArrayField,
  SingleFieldList,
  TopToolbar,
} from 'react-admin';
import PropTypes from 'prop-types';

import { Breadcrumb, ResourceBreadcrumbItems } from '../components/menu';

const TagBreadcrumb = (props) => (
  <Breadcrumb {...props}>
    <ResourceBreadcrumbItems />
  </Breadcrumb>
);

const TalksField = ({ record = {} }) => <span>{record.talks.length}</span>;

TalksField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
};

const TagPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50]} {...props} />
);

const TagFilters = (props) => (
  <Filter {...props}>
    <TextInput source="label" alwaysOn />
  </Filter>
);

const TagList = (props) => {
  return (
    <List
      {...props}
      filters={<TagFilters />}
      filterDefaultValues={{}}
      sort={{ field: 'nbTalks', order: 'DESC' }}
      exporter={false}
      pagination={<TagPagination />}
      bulkActionButtons={false}
    >
      <Datagrid>
        <TextField source="label" sortable={true} />
        <NumberField
          source="nbTalks"
          label="Nombre de talks associés"
          sortable={true}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const TagTitle = ({ record }) =>
  record ? `Edition du tag "${record.label}"` : null;

const TagEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <Breadcrumb variant="actions" />
  </TopToolbar>
);

export const TagEdit = (props) => (
  <>
    <TagBreadcrumb />
    <Edit actions={<TagEditActions />} title={<TagTitle />} {...props}>
      <SimpleForm>
        <TextInput fullWidth source="label" validate={required()} />
        <ReferenceArrayField
          label="Talks associés"
          reference="talks"
          source="talks"
        >
          <SingleFieldList>
            <ChipField source="title" />
          </SingleFieldList>
        </ReferenceArrayField>
      </SimpleForm>
    </Edit>
  </>
);

export const TagCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput fullWidth source="label" validate={required()} />
    </SimpleForm>
  </Create>
);

const tags = {
  icon: TagIcon,
  list: TagList,
  edit: TagEdit,
  create: TagCreate,
};

export default tags;
