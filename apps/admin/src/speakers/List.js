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
} from "react-admin";

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
    //   pagination={<SpeakerPagination />}
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

export default SpeakerList;
