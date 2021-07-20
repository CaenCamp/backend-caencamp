import React from 'react';
import { PropTypes } from 'prop-types';
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    Filter,
    TextInput,
    Pagination,
} from 'react-admin';

const EditionLogo = ({ record }) => {
    return record && record.image ? (
        <img src={record.image} height="50" alt={record.name} />
    ) : (
        `Pas d'image pour "${record.name}"`
    );
};
EditionLogo.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
    }),
};

const EditionAddress = ({ record: { address } }) => {
    return address
        ? `${address.streetAddress} ${address.postalCode} ${address.addressLocality}`
        : "L'adresse n'est pas renseignée.";
};

// const EditionFilter = (props) => (
//     <Filter {...props}>
//         <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
//         <TextInput
//             source="addressLocality:l%"
//             label="Filtre par ville"
//             alwaysOn
//         />
//         <TextInput
//             source="postalCode:l%"
//             label="Filtre par code postal"
//             alwaysOn
//         />
//     </Filter>
// );
const EditionFilter = (props) => (
    <Filter {...props}>
        <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
    </Filter>
);

const EditionPagination = (props) => (
    <Pagination rowsPerPageOptions={[1, 10, 25, 50]} {...props} />
);

export const EditionList = ({ permissions, ...props }) => {
    return (
        <List
            {...props}
            filters={<EditionFilter />}
            sort={{ field: 'number', order: 'ASC' }}
            exporter={false}
            pagination={<EditionPagination />}
            bulkActionButtons={false}
            title="Liste des Editions"
        >
            <Datagrid>
                <TextField source="title" label="Titre" />
                {permissions === 'authenticated' && <EditButton />}
            </Datagrid>
        </List>
    );
};

EditionList.propTypes = {
    permissions: PropTypes.string.isRequired,
};
