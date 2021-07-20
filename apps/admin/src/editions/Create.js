import React from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const EditionCreate = (props) => (
    <Create {...props} title="Création d'une edition">
        <SimpleForm>
            <TextInput
                fullWidth
                label="titre"
                source="title"
                validate={required()}
            />
            <TextInput
                fullWidth
                multiline
                label="Présentation"
                source="shortDescription"
                validate={required()}
            />
        </SimpleForm>
    </Create>
);
