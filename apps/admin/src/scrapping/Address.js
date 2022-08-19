import * as React from 'react';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';

const AddressField = ({ className, record = {}, ...rest }) => {
    return (
        <Typography component="span" variant="body2" className={className} {...rest}>
            {record.address.streetAddress} <br />
            {record.address.postalCode} {record.address.addressLocality} {record.address.addressCountry}
        </Typography>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
AddressField.displayName = 'AddressField';

const EnhancedAddressField = pure(AddressField);

EnhancedAddressField.defaultProps = {
    addLabel: true,
};

EnhancedAddressField.propTypes = {
    ...Typography.propTypes,
};

EnhancedAddressField.displayName = 'EnhancedAddressField';

export default EnhancedAddressField;
