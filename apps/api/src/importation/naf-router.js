const Router = require('koa-router');

const { getOne, getPaginatedList } = require('./naf-repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/nafs',
});

router.get('/', async (ctx) => {
    const { nafs, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/nafs',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = nafs;
});

router.get('/:code', async (ctx) => {
    const naf = await getOne(ctx.params.code);

    if (!naf.id) {
        const explainedError = new Error(`The naf code of id ${ctx.params.code} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (naf.error) {
        const explainedError = new Error(naf.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = naf;
});

module.exports = router;
