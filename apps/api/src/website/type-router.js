const Router = require('koa-router');

const {
    deleteOne,
    createOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./type-repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/website-types',
});

router.get('/', async (ctx) => {
    const { websiteTypes, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/website-type',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = websiteTypes;
});

router.post('/', async (ctx) => {
    const newType = await createOne(ctx.request.body);

    if (newType.error) {
        const explainedError = new Error(newType.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newType;
});

router.get('/:typeId', async (ctx) => {
    const type = await getOne(ctx.params.typeId);

    if (!type.id) {
        const explainedError = new Error(
            `The type of id ${ctx.params.typeId} does not exist.`
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

router.delete('/:typeId', async (ctx) => {
    const deletedType = await deleteOne(ctx.params.typeId);

    if (!deletedType.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.typeId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedType.error) {
        const explainedError = new Error(deletedType.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedType;
});

router.put('/:typeId', async (ctx) => {
    const updatedType = await updateOne(
        ctx.params.typeId,
        ctx.request.body
    );

    if (updatedType.error) {
        const explainedError = new Error(updatedType.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedType.id) {
        const explainedError = new Error(
            `The type of id ${ctx.params.typeId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedType;
});

module.exports = router;
