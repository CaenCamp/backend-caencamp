const Router = require('koa-router');

const {
    deleteOne,
    createOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/websites',
});

router.get('/', async (ctx) => {
    const { websites, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/websites',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = websites;
});

router.post('/', async (ctx) => {
    const newWebSite = await createOne(ctx.request.body);

    if (newWebSite.error) {
        const explainedError = new Error(newWebSite.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newWebSite;
});

router.get('/:websiteId', async (ctx) => {
    const website = await getOne(ctx.params.websiteId);

    if (!!website || !website.id) {
        const explainedError = new Error(
            `The website of id ${ctx.params.websiteId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (website.error) {
        const explainedError = new Error(website.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = website;
});

router.delete('/:websiteId', async (ctx) => {
    const deletedWebsite = await deleteOne(ctx.params.websiteId);

    if (!deletedWebsite.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.websiteId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedWebsite.error) {
        const explainedError = new Error(deletedWebsite.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedWebsite;
});

router.put('/:websideId', async (ctx) => {
    const updatedWebsite = await updateOne(
        ctx.params.websideId,
        ctx.request.body
    );

    if (updatedWebsite.error) {
        const explainedError = new Error(updatedWebsite.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedWebsite.id) {
        const explainedError = new Error(
            `The website of id ${ctx.params.websideId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedWebsite;
});

module.exports = router;
