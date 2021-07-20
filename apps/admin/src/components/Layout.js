import { Layout } from 'react-admin';
import { AppLocationContext } from './menu';
import CaenCampMenu from './CaenCampMenu';

const CaenCampLayout = props => {
    return (
        <AppLocationContext>
            <Layout {...props} menu={CaenCampMenu} />
        </AppLocationContext>
    );
};

export default CaenCampLayout;
