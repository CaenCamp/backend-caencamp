import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import jobBoardDataProvider from './jobBoardDataProvider';
import { authProvider } from './authProvider';
import inMemoryJWT from './inMemoryJWT';
import LoginPage from './LoginPage';
import LogoutButton from './LogoutButton';

import Organization from './organization';
import jobPosting from './job-posting';
import webSiteTypes from './website/websiteTypes';

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

const dataProvider = jobBoardDataProvider(
    'http://localhost:3001/api',
    httpClient
);

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        loginPage={LoginPage}
        logoutButton={LogoutButton}
    >
        {(permissions) => [
            <Resource
                key="organisation"
                name="organizations"
                list={Organization.list}
                edit={
                    permissions === 'authenticated' ? Organization.edit : null
                }
                create={
                    permissions === 'authenticated' ? Organization.create : null
                }
                icon={Organization.icon}
                option={Organization.option}
            />,
            <Resource
                key="job-posting"
                name="job-postings"
                list={jobPosting.list}
                edit={permissions === 'authenticated' ? jobPosting.edit : null}
                create={
                    permissions === 'authenticated' ? jobPosting.create : null
                }
                icon={jobPosting.icon}
                option={jobPosting.option}
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
        ]}
    </Admin>
);

export default App;
