import React from "react";
import PropTypes from "prop-types";
import {
  Datagrid,
  EditButton,
  Filter,
  List,
  Pagination,
  TextField,
  TextInput,
  ChipField,
  ReferenceArrayField,
  SingleFieldList,
  ReferenceField,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const TalkFilters = (props) => (
  <Filter {...props}>
    <TextInput
            source="title:%l%"
            label="Titre"
            alwaysOn
    />
    <ReferenceInput label="Type" source="typeId" reference="talk-types" alwaysOn>
      <SelectInput optionText="label" />
    </ReferenceInput>
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
        <TextField label="Titre" source="title" sortable={true} />
        <ReferenceField label="Type" source="typeId" reference="talk-types">
            <ChipField source="label" />
        </ReferenceField>
        <TextField label="En bref" source="shortDescription" sortable={false} />
        <ReferenceArrayField
          label="Le.s speaker.s"
          reference="speakers"
          source="speakers"
          perPage={100}
        >
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <ReferenceArrayField
          label="Le.s tag.s"
          reference="tags"
          source="tags"
          perPage={100}
        >
          <SingleFieldList>
            <ChipField source="label" />
          </SingleFieldList>
        </ReferenceArrayField>
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default TalkList;
