const Router = require('koa-router');

const { getOne, getPaginatedList } = require('./public-repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/events',
});

const defaultQueryParameters = {
    category: 'CaenCamp',
    currentPage: 1,
    orderBy: 'DESC',
    perPage: 200,
    sortBy: 'number',
    when: 'all',
};

router.get('/', async (ctx) => {
    const { editions, pagination } = await getPaginatedList({
        ...defaultQueryParameters,
        ...ctx.query,
    });

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/events',
        pagination,
    });

    ctx.set('X-Total-Count', parseInt(pagination.total, 10));
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = editions;
});

router.get('/:eventSlug', async (ctx) => {
    const edition = await getOne(ctx.params.eventSlug);

    if (!edition) {
        const explainedError = new Error(`The event of id ${ctx.params.eventSlug} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (edition.error) {
        const explainedError = new Error(edition.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = edition;
});

module.exports = router;
