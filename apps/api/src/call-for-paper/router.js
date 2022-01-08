const Router = require('koa-router');

const { deleteOne, createOne, getOne, getPaginatedList, updateOne } = require('./repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/papers',
});

router.get('/', async (ctx) => {
    const { papers, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/papers',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = papers;
});

router.post('/', async (ctx) => {
    const newPaper = await createOne(ctx.request.body);

    if (newPaper.error) {
        const explainedError = new Error(newPaper.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newPaper;
});

router.get('/:paperId', async (ctx) => {
    const paper = await getOne(ctx.params.paperId);

    if (!paper.id) {
        const explainedError = new Error(`The paper of id ${ctx.params.paperId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (paper.error) {
        const explainedError = new Error(paper.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = paper;
});

router.delete('/:paperId', async (ctx) => {
    const deletedPaper = await deleteOne(ctx.params.paperId);

    if (!deletedPaper.id) {
        const explainedError = new Error(`The speaker of id ${ctx.params.paperId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedPaper.error) {
        const explainedError = new Error(deletedPaper.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedPaper;
});

router.put('/:paperId', async (ctx) => {
    const updatedPaper = await updateOne(ctx.params.paperId, ctx.request.body);

    if (updatedPaper.error) {
        const explainedError = new Error(updatedPaper.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedPaper.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.paperId} does not exist, so it could not be updated`,
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedPaper;
});

module.exports = router;
