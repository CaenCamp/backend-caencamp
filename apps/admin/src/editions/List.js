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
    ReferenceInput,
    SelectInput,
    ReferenceField,
    ChipField,
} from 'react-admin';

const EditionFilter = (props) => (
    <Filter {...props}>
        <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
        <ReferenceInput label="Mode" source="modeId" reference="edition-modes" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
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
            sort={{ field: 'number', order: 'DESC' }}
            exporter={false}
            pagination={<EditionPagination />}
            bulkActionButtons={false}
            title="Liste des Editions"
        >
            <Datagrid>
                <TextField source="title" label="Titre" />
                <TextField source="number" label="Numero" />
                <ReferenceField label="Categorie" source="categoryId" reference="edition-categories">
                    <ChipField source="label" />
                </ReferenceField>
                <ReferenceField label="Mode" source="modeId" reference="edition-modes">
                    <ChipField source="label" />
                </ReferenceField>
                <EditButton />
            </Datagrid>
        </List>
    );
};

EditionList.propTypes = {
    permissions: PropTypes.string.isRequired,
};
