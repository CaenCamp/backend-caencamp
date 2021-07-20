import React from 'react';
import { Edit, TextInput, TabbedForm, FormTab, required } from 'react-admin';

const EditionTitle = ({ record }) =>
    record ? `Edition ${record.title}` : null;

export const EditionEdit = (props) => {
    const handleStringify = React.useCallback(
        (v) => JSON.stringify(v, null, 2),
        []
    );
    const handleParse = React.useCallback((v) => JSON.parse(v), []);

    return (
        <Edit title={<EditionTitle />} {...props}>
            <TabbedForm>
                <FormTab label="L'edition">
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
                </FormTab>
                <FormTab label="Le lieux">
                    <h3>Places</h3>
                </FormTab>
                <FormTab label="Les talks">
                    <h3>Talks</h3>
                </FormTab>
                <FormTab label="Les sponsors">
                    <h3>Sponsors</h3>
                </FormTab>
            </TabbedForm>
        </Edit>
    );
};
