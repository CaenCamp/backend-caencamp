import React from 'react';
import TokenIcon from '@material-ui/icons/BlurCircular';
import {
    Datagrid,
    Create,
    DateField,
    Edit,
    EditButton,
    Filter,
    List,
    Pagination,
    SimpleForm,
    TextField,
    TextInput,
    required,
} from 'react-admin';
import PropTypes from 'prop-types';

const TokensField = ({ record = {} }) => <span>{record.talks.length}</span>;

TokensField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
};

const TokenPagination = (props) => <Pagination rowsPerPageOptions={[10, 25, 50]} {...props} />;

const TokenFilters = (props) => (
    <Filter {...props}>
        <TextInput source="label" alwaysOn />
    </Filter>
);

const TokenList = (props) => {
    return (
        <List
            {...props}
            filters={<TokenFilters />}
            filterDefaultValues={{}}
            sort={{ field: 'id', order: 'DESC' }}
            exporter={false}
            pagination={<TokenPagination />}
            bulkActionButtons={false}
        >
            <Datagrid>
                <TextField source="id" label="Token" sortable={false} />
                <TextField source="owner" label="Utilisateur" sortable={false} />
                <DateField source="createdAt" label="Créé le" showTime />
                <DateField source="lastUseAt" label="Dernière utilisation" showTime />
                <EditButton />
            </Datagrid>
        </List>
    );
};

const TokenTitle = ({ record }) => (record ? `Edition du token "${record.owner}"` : null);

export const TokenEdit = (props) => (
    <Edit title={<TokenTitle />} {...props}>
        <SimpleForm>
            <TextInput fullWidth source="owner" label="Utilisateur" validate={required()} />
        </SimpleForm>
    </Edit>
);

export const TokenCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput fullWidth source="owner" label="Utilisateur" validate={required()} />
        </SimpleForm>
    </Create>
);

const tokens = {
    icon: TokenIcon,
    list: TokenList,
    edit: TokenEdit,
    create: TokenCreate,
};

export default tokens;
