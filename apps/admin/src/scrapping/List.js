import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    Filter,
    TextInput,
    Pagination,
    DateField,
    UrlField,
    ReferenceField,
    ReferenceInput,
    SelectInput,
} from 'react-admin';

const OrganizationAddress = ({ record: { streetAddress, postalCode, addressLocality } }) => {
    return postalCode ? `${streetAddress} ${postalCode} ${addressLocality}` : "L'adresse n'est pas renseignée.";
};

const OrganizationFilter = (props) => (
    <Filter {...props}>
        <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
        <TextInput source="addressLocality:l%" label="Filtre par ville" alwaysOn />
        <TextInput source="postalCode:l%" label="Filtre par code postal" alwaysOn />
        <ReferenceInput label="Activité" source="codeNafId" reference="nafs" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
        <ReferenceInput label="Effectifs" source="staffingId" reference="staffings" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
        <ReferenceInput label="Statut" source="legalStructureId" reference="legals" alwaysOn>
            <SelectInput optionText="label" />
        </ReferenceInput>
    </Filter>
);

const OrganizationPagination = (props) => <Pagination rowsPerPageOptions={[25, 50, 100]} {...props} />;

export const OrganizationList = (props) => {
    return (
        <List
            {...props}
            filters={<OrganizationFilter />}
            sort={{ field: 'name', order: 'ASC' }}
            exporter={true}
            pagination={<OrganizationPagination />}
            bulkActionButtons={false}
            title="Les Entreprises scrappées"
            perPage={50}
        >
            <Datagrid>
                <TextField source="name" label="Nom de l'entreprise" />
                <UrlField source="url" label="web" />
                <OrganizationAddress label="Adresse" />
                <DateField source="creationDate" label="Date de création" />
                <ReferenceField label="NAF" source="codeNafId" reference="nafs" link={false}>
                    <TextField source="label" />
                </ReferenceField>
                <ReferenceField label="Effectifs" source="staffingId" reference="staffings" link={false}>
                    <TextField source="label" />
                </ReferenceField>
                <ReferenceField label="Statut" source="legalStructureId" reference="legals" link={false}>
                    <TextField source="label" />
                </ReferenceField>
            </Datagrid>
        </List>
    );
};
