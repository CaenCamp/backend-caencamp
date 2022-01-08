const Router = require('koa-router');

const { deleteOne, createOne, getOne, getPaginatedList, updateOne } = require('./repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/tokens',
});

router.get('/', async (ctx) => {
    const { tokens, pagination } = await getPaginatedList(ctx.query);
    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/tokens',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = tokens;
});

router.post('/', async (ctx) => {
    const newToken = await createOne(ctx.request.body);

    if (newToken.error) {
        const explainedError = new Error(newToken.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newToken;
});

router.get('/:tokenId', async (ctx) => {
    const token = await getOne(ctx.params.tokenId);

    if (!token.id) {
        const explainedError = new Error(`The token of id ${ctx.params.tokenId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (token.error) {
        const explainedError = new Error(token.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = token;
});

router.delete('/:tokenId', async (ctx) => {
    const deletedToken = await deleteOne(ctx.params.tokenId);

    if (!deletedToken.id) {
        const explainedError = new Error(`The token of id ${ctx.params.tokenId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedToken.error) {
        const explainedError = new Error(deletedToken.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedToken;
});

router.put('/:tokenId', async (ctx) => {
    const updatedToken = await updateOne(ctx.params.tokenId, ctx.request.body);

    if (updatedToken.error) {
        const explainedError = new Error(updatedToken.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedToken.id) {
        const explainedError = new Error(
            `The token of id ${ctx.params.tokenId} does not exist, so it could not be updated`,
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedToken;
});

module.exports = router;
