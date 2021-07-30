import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import EditionIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SpeakerIcon from '@material-ui/icons/RecordVoiceOver';
import OrganizationIcon from '@material-ui/icons/Domain';
import JobPostingIcon from '@material-ui/icons/EventSeat';

import {
    Menu,
    MenuItem,
    MenuItemCategory,
    MultiLevelMenu,
} from './menu';

const useStyles = makeStyles({
    // Custom styles for the configuration item so that it appears at the very bottom of the sidebar
    configuration: {
        marginTop: 'auto',
    },
});

const CaenCampMenu = () => {
    const classes = useStyles();

    return (
        <MultiLevelMenu variant="categories">
            <MenuItemCategory
                name="dashboard"
                to="/"
                exact
                label="Dashboard"
                icon={<DashboardIcon />}
            />
            {/* The empty filter is required to avoid falling back to the previously set filter */}
            <MenuItemCategory
                name="editions"
                to={'/editions?filter={}'}
                label="Les rencontres"
                icon={<EditionIcon />}
            >
                {/* CardContent to get consistent spacings */}
                <CardContent>
                    {/* Note that we must wrap our MenuItem components in a Menu */}
                    <Menu>
                        <MenuItem
                            name="editions.caencamp"
                            to={'/editions?filter=%7B"categoryId"%3A"26311f0a-6846-4c90-af26-74ec95479886"%7D'}
                            label="CaenCamp"
                        />
                        <MenuItem
                            name="editions.coding"
                            to={'/editions?filter=%7B"categoryId"%3A"ccae06c2-81e6-415c-a8d4-54b19a306d2c"%7D'}
                            label="Coding"
                        />
                        <MenuItem
                            name="editions.devops"
                            to={'/editions?filter=%7B"categoryId"%3A"07af0ca4-e84c-4cf7-87e2-96aaa48edd29"%7D'}
                            label="Devops"
                        />
                    </Menu>
                    <Typography variant="h5" gutterBottom style={{ marginTop: '1rem'}}>
                        Configurations
                    </Typography>
                    <Menu>
                        <MenuItem
                            name="editions.places"
                            to={'/places?filter={}'}
                            label="Les lieux"
                        />
                        <MenuItem
                            name="editions.categories"
                            to={'/edition-categories?filter={}'}
                            label="Les categories"
                        />
                        <MenuItem
                            name="editions.modes"
                            to={'/edition-modes?filter={}'}
                            label="Les modes"
                        />
                    </Menu>
                </CardContent>
            </MenuItemCategory>
            <MenuItemCategory
                name="speakers"
                to={'/speakers?filter={}'}
                label="Les speakers"
                icon={<SpeakerIcon />}
            >
                {/* CardContent to get consistent spacings */}
                <CardContent>
                    {/* Note that we must wrap our MenuItem components in a Menu */}
                    <Menu>
                        <MenuItem
                            name="speakers.all"
                            to={'/speakers?filter={}'}
                            label="Les speakers"
                        />
                        <MenuItem
                            name="speakers.talks"
                            to={'/talks?filter={}'}
                            label="Les talks"
                        />
                    </Menu>
                    <Typography variant="h5" gutterBottom style={{ marginTop: '1rem'}}>
                        Configurations
                    </Typography>
                    <Menu>
                        <MenuItem
                            name="speakers.tags"
                            to={'/tags?filter={}'}
                            label="Les tags"
                        />
                        <MenuItem
                            name="speakers.talktypes"
                            to={'/talk-types?filter={}'}
                            label="Les types de talks"
                        />
                        <MenuItem
                            name="speakers.sitetypes"
                            to={'/website-types?filter={}'}
                            label="Les types de sites"
                        />
                    </Menu>
                </CardContent>
            </MenuItemCategory>
            <MenuItemCategory
                name="jobs"
                to={'/job-postings?filter={}'}
                label="Les offres d'emploi"
                icon={<JobPostingIcon />}
            >
                {/* CardContent to get consistent spacings */}
                <CardContent>
                    <Menu>
                        <MenuItem
                            name="jobs.active"
                            to={'/job-postings?filter={}'}
                            label="Les offres actives"
                        />
                        <MenuItem
                            name="jobs.proposed"
                            to={'/job-postings?filter={}'}
                            label="Les offres à valider"
                        />
                        <MenuItem
                            name="jobs.outdated"
                            to={'/job-postings?filter={}'}
                            label="Les offres périmées"
                        />
                    </Menu>
                </CardContent>
            </MenuItemCategory>
            <MenuItemCategory
                name="organizations"
                to="/organizations"
                exact
                label="Annuaire des boites"
                icon={<OrganizationIcon />}
            />
        </MultiLevelMenu>
    );
};

export default CaenCampMenu;
