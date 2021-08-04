const Router = require('koa-router');

const {
    getOne,
    getPaginatedList,
} = require('./public-repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/events',
});

router.get('/', async (ctx) => {
    const { editions, pagination } = await getPaginatedList({
        ...ctx.query,
        currentPage: ctx.query.currentPage || 1,
        perPage: ctx.query.perPage || 100,
    });

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/events',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = editions;
});

router.get('/:eventId', async (ctx) => {
    const edition = await getOne(ctx.params.eventId);

    if (!edition.id) {
        const explainedError = new Error(
            `The event of id ${ctx.params.eventId} does not exist.`
        );
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
