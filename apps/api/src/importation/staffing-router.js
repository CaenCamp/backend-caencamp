const Router = require('koa-router');

const { getOne, getPaginatedList } = require('./staffing-repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/staffings',
});

router.get('/', async (ctx) => {
    const { staffings, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/staffings',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = staffings;
});

router.get('/:code', async (ctx) => {
    const staf = await getOne(ctx.params.code);

    if (!staf.id) {
        const explainedError = new Error(`The staf code of id ${ctx.params.code} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (staf.error) {
        const explainedError = new Error(staf.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = staf;
});

module.exports = router;
