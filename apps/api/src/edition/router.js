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
    prefix: '/editions',
});

router.get('/', async (ctx) => {
    const { editions, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/editions',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = editions;
});

router.post('/', async (ctx) => {
    const newEdition = await createOne(ctx.request.body);

    if (newEdition.error) {
        const explainedError = new Error(newEdition.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newEdition;
});

router.get('/:editionId', async (ctx) => {
    const edition = await getOne(ctx.params.editionId);

    if (!edition.id) {
        const explainedError = new Error(
            `The edition of id ${ctx.params.editionId} does not exist.`
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

router.delete('/:editionId', async (ctx) => {
    const deletedEdition = await deleteOne(ctx.params.editionId);

    if (!deletedEdition.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.editionId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedEdition.error) {
        const explainedError = new Error(deletedEdition.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedEdition;
});

router.put('/:editionId', async (ctx) => {
    const updatedEdition = await updateOne(
        ctx.params.editionId,
        ctx.request.body
    );

    if (updatedEdition.error) {
        const explainedError = new Error(updatedEdition.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedEdition.id) {
        const explainedError = new Error(
            `The tag of id ${ctx.params.editionId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedEdition;
});

module.exports = router;
