import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';
import { useTheme } from '@material-ui/core';

import dataProvider from './dataProvider';
import { authProvider } from './authProvider';

// import Dashboard from "./components/Dashboard";
import CaenCampLayout from './components/Layout';
import { getThemes } from './components/theme';

import editions from './editions';
import editionCategories from './editions/categories';
import editionModes from './editions/modes';
import jobPostings from './job-postings';
import organizations from './organizations';
import places from './places';
import speakers from './speakers';
import tags from './tags';
import talks from './talks';
import talkTypes from './talks/types';
import webSites from './websites';
import webSiteTypes from './websites/types';

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

export const getApiUrl = () => process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3001/';

const host = `${getApiUrl()}api-admin`;

const caenCampDataProvider = dataProvider(
  host,
  httpClient
);

const App = () => {
  const theme = useTheme();
  const { lightTheme } = getThemes(theme);
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={caenCampDataProvider}
      disableTelemetry
      layout={CaenCampLayout}
      // Ra-enterprise confirguration
      theme={lightTheme}
    >
      <Resource name="organizations" {...organizations} />
      <Resource name="job-postings" {...jobPostings} />
      <Resource name="website-types" {...webSiteTypes} />
      <Resource name="websites" {...webSites} />
      <Resource name="tags" {...tags} />
      <Resource name="talk-types" {...talkTypes} />
      <Resource name="speakers" {...speakers} />
      <Resource name="talks" {...talks} />
      <Resource name="places" {...places} />
      <Resource name="edition-categories" {...editionCategories} />
      <Resource name="edition-modes" {...editionModes} />
      <Resource name="editions" {...editions} />
    </Admin>
  );
};

export default App;
