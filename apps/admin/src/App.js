import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import dataProvider from './dataProvider';
import { authProvider } from './authProvider';
import inMemoryJWT from './inMemoryJWT';
import LoginPage from './LoginPage';
import LogoutButton from './LogoutButton';

import jobPostings from './job-postings';
import organizations from './organizations';
import speakers from './speakers';
import tags from './tags';
import talkTypes from './talks/types';
import webSiteTypes from './websites/types';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = inMemoryJWT.getToken();
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const caenCampDataProvider = dataProvider(
    'http://localhost:3001/api',
    httpClient
);

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={caenCampDataProvider}
        loginPage={LoginPage}
        logoutButton={LogoutButton}
    >
        {(permissions) => [
            <Resource
                key="organisation"
                name="organizations"
                list={organizations.list}
                edit={
                    permissions === 'authenticated' ? organizations.edit : null
                }
                create={
                    permissions === 'authenticated' ? organizations.create : null
                }
                icon={organizations.icon}
                option={organizations.option}
            />,
            <Resource
                key="job-posting"
                name="job-postings"
                list={jobPostings.list}
                edit={permissions === 'authenticated' ? jobPostings.edit : null}
                create={
                    permissions === 'authenticated' ? jobPostings.create : null
                }
                icon={jobPostings.icon}
                option={jobPostings.option}
            />,
            <Resource
                key="website-types"
                name="website-types"
                list={webSiteTypes.list}
                edit={permissions === 'authenticated' ? webSiteTypes.edit : null}
                create={
                    permissions === 'authenticated' ? webSiteTypes.create : null
                }
                icon={webSiteTypes.icon}
                option={webSiteTypes.option}
            />,
            <Resource
                key="tags"
                name="tags"
                list={tags.list}
                edit={permissions === 'authenticated' ? tags.edit : null}
                create={
                    permissions === 'authenticated' ? tags.create : null
                }
                icon={tags.icon}
                option={tags.option}
            />,
            <Resource
                key="talk-types"
                name="talk-types"
                list={talkTypes.list}
                edit={permissions === 'authenticated' ? talkTypes.edit : null}
                create={
                    permissions === 'authenticated' ? talkTypes.create : null
                }
                icon={talkTypes.icon}
                option={talkTypes.option}
            />,
            <Resource
                key="speakers"
                name="speakers"
                list={speakers.list}
                edit={permissions === 'authenticated' ? speakers.edit : null}
                create={
                    permissions === 'authenticated' ? speakers.create : null
                }
                icon={speakers.icon}
                option={speakers.option}
            />,
        ]}
    </Admin>
);

export default App;
