import React, { useEffect, useRef } from 'react';
import merge from 'lodash.merge';
import { InputHelperText, Labeled, useInput } from 'react-admin';
import { FormHelperText } from '@material-ui/core';

//import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export const MarkdownInput = ({
    fullWidth,
    helperText,
    label,
    options,
    resource,
    source,
    ...rest
}) => {
    const editorRef = useRef();

    const {
        input: { onChange, value },
        isRequired,
        meta,
    } = useInput({
        source,
        ...rest,
    });

    const { error, submitError, touched } = meta;

    const handleChange = editor => {
        onChange(editor.getMarkdown());
    };

    useEffect(() => {
        if (editorRef && editorRef.current) {
            const instance = editorRef.current.getInstance();
            instance.addHook('change', () => handleChange(instance));
        }
    }, [editorRef]); // eslint-disable-line react-hooks/exhaustive-deps

    const mergedOptions = merge({}, defaultOptions, options);

    return (
        <Labeled
            fullWidth={fullWidth}
            isRequired={isRequired}
            label={label}
            meta={meta}
            resource={resource}
            source={source}
        >
            <>
                <Editor
                    initialValue={value}
                    ref={editorRef}
                    {...mergedOptions}
                />
                <FormHelperText error={touched && (error || submitError)}>
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                </FormHelperText>
            </>
        </Labeled>
    );
};

const defaultOptions = {
    previewStyle: 'vertical',
    height: '512px',
    initialEditType: 'wysiwyg',
    useCommandShortcut: true,
};

MarkdownInput.defaultProps = {
    fullWidth: true,
    options: defaultOptions,
};

export const caenCampOptions = {
    previewStyle: 'tab',
    height: '500px',
    initialEditType: 'markdown',
    useCommandShortcut: true,
    toolbarItems: [
        ['heading', 'bold', 'italic'],
        ['ul', 'quote', 'indent', 'outdent'],
        ['table', 'link', 'code'],
      ]
};
