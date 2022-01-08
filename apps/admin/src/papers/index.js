import React from 'react';
import PaperIcon from '@material-ui/icons/FindInPage';
import {
    Datagrid,
    Create,
    DateField,
    Edit,
    EditButton,
    Filter,
    List,
    Pagination,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    required,
} from 'react-admin';

const statusValues = [
    { id: 'submitted', name: 'Proposé' },
    { id: 'accepted', name: 'Accepté' },
    { id: 'refused', name: 'Refusé' },
];

const PaperPagination = (props) => <Pagination rowsPerPageOptions={[10, 25, 50]} {...props} />;

const PaperFilters = (props) => (
    <Filter {...props}>
        <SelectInput source="status" choices={statusValues} alwaysOn />
    </Filter>
);

const PaperList = (props) => {
    return (
        <List
            {...props}
            filters={<PaperFilters />}
            filterDefaultValues={{ status: 'submitted' }}
            sort={{ field: 'createdAt', order: 'DESC' }}
            exporter={false}
            pagination={<PaperPagination />}
            bulkActionButtons={false}
        >
            <Datagrid>
                <TextField source="title" label="Titre" sortable={false} />
                <TextField source="name" label="Proposé par" sortable={false} />
                <DateField source="createdAt" label="Proposé le" showTime />
                <TextField source="status" label="Statut" sortable={true} />
                <EditButton />
            </Datagrid>
        </List>
    );
};

const PaperTitle = ({ record }) => (record ? `Etude du la propositon "${record.title}"` : null);

export const PaperEdit = (props) => (
    <Edit title={<PaperTitle />} {...props}>
        <SimpleForm>
            <TextInput fullWidth source="name" label="Proposer par" validate={required()} />
            <TextInput fullWidth source="title" label="Titre" validate={required()} />
            <TextInput fullWidth source="description" label="Résumé" validate={required()} multiline />
            <TextInput fullWidth source="contact" label="Contact" validate={required()} multiline />
            <SelectInput source="status" choices={statusValues} alwaysOn />
        </SimpleForm>
    </Edit>
);

export const PaperCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput fullWidth source="name" label="Proposer par" validate={required()} />
            <TextInput fullWidth source="title" label="Titre" validate={required()} />
            <TextInput fullWidth source="description" label="Résumé" validate={required()} multiline />
            <TextInput fullWidth source="contact" label="Contact" validate={required()} multiline />
        </SimpleForm>
    </Create>
);

const papers = {
    icon: PaperIcon,
    list: PaperList,
    edit: PaperEdit,
    create: PaperCreate,
};

export default papers;
