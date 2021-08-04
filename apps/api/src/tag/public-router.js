const Router = require('koa-router');

const {
    getPublicPaginatedList,
} = require('./repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/tags',
});

router.get('/', async (ctx) => {
    const { tags, pagination } = await getPublicPaginatedList({
        ...ctx.query,
        currentPage: ctx.query.currentPage || 1,
        perPage: ctx.query.perPage || 100,
    });

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/tags',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = tags;
});

module.exports = router;
