import React from 'react';
import {
    Edit,
    TextInput,
    required,
    TabbedForm,
    FormTab,
    ReferenceInput,
    SelectInput,
    ReferenceArrayInput,
    SelectArrayInput,
} from 'react-admin';

import { MarkdownInput, caenCampOptions } from '../components/inputs/MarkdownInput';

const TalkTitle = ({ record }) => (record ? `Talk "${record.title}"` : null);

const TalkEdit = (props) => (
    <Edit title={<TalkTitle />} {...props}>
        <TabbedForm>
            <FormTab label="Content">
                <TextInput fullWidth source="title" validate={required()} />
                <ReferenceInput label="Type" source="typeId" reference="talk-types">
                    <SelectInput optionText="label" />
                </ReferenceInput>
                <ReferenceArrayInput source="speakers" reference="speakers" perPage={100}>
                    <SelectArrayInput optionText="name" />
                </ReferenceArrayInput>
                <ReferenceArrayInput source="tags" reference="tags" perPage={100}>
                    <SelectArrayInput optionText="label" />
                </ReferenceArrayInput>
                <TextInput
                    fullWidth
                    source="shortDescription"
                    label="Description rapide"
                    validate={required()}
                    multiline
                />
                <MarkdownInput
                    source="descriptionMarkdown"
                    label="Description complète"
                    validate={required()}
                    options={caenCampOptions}
                />
            </FormTab>
            <FormTab label="Supports">
                <TextInput fullWidth source="video" />
            </FormTab>
        </TabbedForm>
    </Edit>
);

export default TalkEdit;
