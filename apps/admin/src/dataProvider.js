import { stringify } from 'query-string';
import omit from 'lodash.omit';

const getXTotalCountHeaderValue = (headers) => {
    if (!headers.has('x-total-count')) {
        throw new Error('The X-Total-Count header is missing in the HTTP Response.');
    }

    return parseInt(headers.get('x-total-count'), 10);
};

const formatFilters = (filters) => {
    return Object.keys(filters).reduce((acc, filterKey) => {
        const [name, operator = 'eq'] = filterKey.split(':');
        return {
            ...acc,
            [name]: `${filters[filterKey]}:${operator}`,
        };
    }, {});
};

/**
 * Maps react-admin queries to a simple REST API
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sortBy=title&orderBy=ASC&currentPage=1&perPage=24
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}&currentPage=1&perPage=24
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 */
export default (apiUrl, httpClient) => ({
    getList: (resource, params) => {
        const { page: currentPage, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filters = params.filter;
        const query = {
            sortBy: field,
            orderBy: order,
            currentPage,
            perPage,
            ...formatFilters(filters),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json,
                total: getXTotalCountHeaderValue(headers),
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
        const { page: currentPage, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filters = {
            ...params.filter,
            [params.target]: params.id,
        };
        const query = {
            sortBy: field,
            orderBy: order,
            currentPage,
            perPage,
            ...formatFilters(filters),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json,
                total: getXTotalCountHeaderValue(headers),
            };
        });
    },

    update: (resource, params) => {
        let data;
        if (resource === 'job-postings') {
            data = {
                ...omit(params.data, ['id', 'hiringOrganization']),
                hiringOrganizationId: params.data.hiringOrganization.identifier,
            };
        } else {
            data = params.data;
        }
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(({ json }) => ({ data: json }));
    },

    // JobBoard API doesn't handle provide an updateMany route yet,
    // so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map((id) => {
                let data;
                if (resource === 'job-postings') {
                    data = {
                        ...omit(params.data, ['id', 'hiringOrganization']),
                        hiringOrganizationId: params.data.hiringOrganization.identifier,
                    };
                } else {
                    data = params.data;
                }
                return httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                }).then(({ json }) => ({ data: json }));
            }),
        ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

    create: (resource, params) => {
        let data;
        if (resource === 'organizations') {
            data = {
                ...omit(params.data, ['address', 'contact_name', 'contact_email', 'contact_phone']),
                address: {
                    ...params.data.address,
                    addressCountry: 'FR',
                },
                contactPoints: [
                    {
                        email: params.data.contact_email || params.data.email,
                        telephone: params.data.contact_phone || params.data.telephone || null,
                        name: params.data.contact_name,
                        contactType: "Offres d'emploi",
                    },
                ],
            };
        } else if (resource === 'job-postings') {
            const now = new Date();
            data = {
                ...params.data,
                datePosted: now.toISOString().substring(0, 10),
            };
        } else {
            data = params.data;
        }
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(({ json }) => ({
            data: { ...data, id: json.id },
        }));
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    // JobBoard doesn't handle filters on DELETE route yet,
    // so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map((id) =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                }),
            ),
        ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
});

// export default dataProvider;
