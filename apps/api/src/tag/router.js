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
    prefix: '/api/tags',
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
    const { tags, pagination } = await getPaginatedList(ctx.query);

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

router.post('/', async (ctx) => {
    const newTag = await createOne(ctx.request.body);

    if (newTag.error) {
        const explainedError = new Error(newTag.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newTag;
});

router.get('/:tagId', async (ctx) => {
    const tag = await getOne(ctx.params.tagId);

    if (!tag.id) {
        const explainedError = new Error(
            `The tag of id ${ctx.params.tagId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (tag.error) {
        const explainedError = new Error(tag.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = tag;
});

router.delete('/:tagId', async (ctx) => {
    const deletedTag = await deleteOne(ctx.params.tagId);

    if (!deletedTag.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.tagId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedTag.error) {
        const explainedError = new Error(deletedTag.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedTag;
});

router.put('/:tagId', async (ctx) => {
    const updatedTag = await updateOne(
        ctx.params.tagId,
        ctx.request.body
    );

    if (updatedTag.error) {
        const explainedError = new Error(updatedTag.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedTag.id) {
        const explainedError = new Error(
            `The tag of id ${ctx.params.tagId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedTag;
});

module.exports = router;
