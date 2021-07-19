import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';

const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api';
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const storedToken = localStorage.getItem('auth');
    if (storedToken) {
        const decodedToken = JSON.parse(storedToken);
        options.headers.set('Authorization', `Bearer ${decodedToken.token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

/**
 * Maps react-admin queries to a simple REST API
 *
 * This REST dialect is similar to the one of FakeRest
 *
 * @see https://github.com/marmelab/FakeRest
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
const getDataProvider = () => ({
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query = {
            page,
            itemsPerPage: perPage,
            [`order[${field}]`]: order,
            ...params.filter,
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url, {
            headers: new Headers({ Accept: 'application/ld+json' }),
        }).then(({ json }) => {
            return {
                data: json['hydra:member'],
                total: json['hydra:totalItems']
            };
        });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        // const rangeStart = (page - 1) * perPage;
        // const rangeEnd = page * perPage - 1;

        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            return httpClient(url).then(({ json }) => {
                return {
                    data: json['hydra:member'],
                    total: json['hydra:totalItems']
                };
            });
        });
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            return { data: json };
        }),

    // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            return {
                data: { ...params.data, id: json.id },
            };
        }),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(() => {
            return { data: { id: params.id} };
        }),

    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                })
            )
        ).then(responses => ({
            data: responses.map(({ json }) => json.id),
        })),
});

export default getDataProvider;
