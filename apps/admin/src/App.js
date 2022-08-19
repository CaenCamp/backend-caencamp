import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import dataProvider from './dataProvider';
import { authProvider } from './authProvider';

// import Dashboard from "./components/Dashboard";

import editions from './editions';
import editionCategories from './editions/categories';
import editionModes from './editions/modes';
import jobPostings from './job-postings';
import organizations from './organizations';
import papers from './papers';
import places from './places';
import speakers from './speakers';
import tags from './tags';
import talks from './talks';
import talkTypes from './talks/types';
import tokens from './tokens';
import webSites from './websites';
import webSiteTypes from './websites/types';

import scrapping from './scrapping';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(localStorage.getItem('auth'));
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

export const getApiUrl = () => (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3001/');

const host = `${getApiUrl()}api-admin`;

const caenCampDataProvider = dataProvider(host, httpClient);

const App = () => {
    return (
        <Admin authProvider={authProvider} dataProvider={caenCampDataProvider} disableTelemetry>
            <Resource name="organizations" {...organizations} />
            <Resource name="job-postings" {...jobPostings} />
            <Resource name="editions" {...editions} />
            <Resource name="talks" {...talks} />
            <Resource name="speakers" {...speakers} />
            <Resource name="papers" {...papers} />
            <Resource name="tags" {...tags} />
            <Resource name="places" {...places} />
            <Resource name="websites" {...webSites} />
            <Resource name="website-types" {...webSiteTypes} />
            <Resource name="talk-types" {...talkTypes} />
            <Resource name="edition-categories" {...editionCategories} />
            <Resource name="edition-modes" {...editionModes} />
            <Resource name="tokens" {...tokens} />
            <Resource name="imported-organizations" {...scrapping} />
            <Resource name="nafs" />
            <Resource name="staffings" />
            <Resource name="legals" />
        </Admin>
    );
};

export default App;
