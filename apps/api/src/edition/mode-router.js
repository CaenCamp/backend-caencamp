const Router = require('koa-router');

const {
    deleteOne,
    createOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./mode-repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/api/edition-modes',
});

router.use(async (ctx, next) => {
    if (
        !ctx.state.jwt &&
        ['POST', 'PUT', 'DELETE'].includes(ctx.request.method)
    ) {
        ctx.throw(401, "You don't have the rights to make this query");

        return;
    }

    await next();
});

router.get('/', async (ctx) => {
    const { modes, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/edition-modes',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = modes;
});

router.post('/', async (ctx) => {
    const newMode = await createOne(ctx.request.body);

    if (newMode.error) {
        const explainedError = new Error(newMode.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newMode;
});

router.get('/:modeId', async (ctx) => {
    const type = await getOne(ctx.params.modeId);

    if (!type.id) {
        const explainedError = new Error(
            `The type of id ${ctx.params.modeId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (type.error) {
        const explainedError = new Error(type.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = type;
});

router.delete('/:modeId', async (ctx) => {
    const deletedMode = await deleteOne(ctx.params.modeId);

    if (!deletedMode.id) {
        const explainedError = new Error(
            `The talk types of id ${ctx.params.modeId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedMode.error) {
        const explainedError = new Error(deletedMode.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedMode;
});

router.put('/:modeId', async (ctx) => {
    const updatedMode = await updateOne(
        ctx.params.modeId,
        ctx.request.body
    );

    if (updatedMode.error) {
        const explainedError = new Error(updatedMode.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedMode.id) {
        const explainedError = new Error(
            `The mode of id ${ctx.params.modeId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedMode;
});

module.exports = router;
