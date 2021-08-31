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
    ReferenceArrayField,
    SingleFieldList,
} from 'react-admin';

const EditionFilter = (props) => (
    <Filter {...props}>
        <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
        <ReferenceInput label="Mode" source="modeId" reference="edition-modes" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
        <ReferenceInput label="Serie" source="categoryId" reference="edition-categories" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
    </Filter>
);

const EditionPagination = (props) => (
    <Pagination rowsPerPageOptions={[25, 50]} {...props} />
);

export const EditionList = ({ permissions, ...props }) => {
    return (
        <List
            {...props}
            filters={<EditionFilter />}
            filterDefaultValues={{ categoryId: '26311f0a-6846-4c90-af26-74ec95479886' }}
            sort={{ field: 'number', order: 'DESC' }}
            exporter={false}
            pagination={<EditionPagination />}
            perPage={50}
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
                <ReferenceArrayField
                    label="Le.s talk.s"
                    reference="talks"
                    source="talks"
                    perPage={100}
                >
                    <SingleFieldList>
                        <ChipField source="title" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <EditButton />
            </Datagrid>
        </List>
    );
};

EditionList.propTypes = {
    permissions: PropTypes.string.isRequired,
};
