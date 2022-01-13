const Router = require('koa-router');

const { getOne, getPaginatedList } = require('./org-repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/imported-organizations',
});

router.get('/', async (ctx) => {
    const { organizations, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/imported-organizations',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = organizations;
});

router.get('/:organizationId', async (ctx) => {
    const organization = await getOne(ctx.params.organizationId);

    if (!organization.id) {
        const explainedError = new Error(`The organization of id ${ctx.params.organizationId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (organization.error) {
        const explainedError = new Error(organization.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = organization;
});

module.exports = router;
