const Router = require('koa-router');

const { deleteOne, createOne, getOne, getPaginatedList, updateOne } = require('./repository');
const { formatPaginationToLinkHeader } = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/talks',
});

router.get('/', async (ctx) => {
    const { talks, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/talks',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = talks;
});

router.post('/', async (ctx) => {
    const newTalk = await createOne(ctx.request.body);

    if (newTalk.error) {
        const explainedError = new Error(newTalk.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newTalk;
});

router.get('/:talkId', async (ctx) => {
    const talk = await getOne(ctx.params.talkId);

    if (!talk.id) {
        const explainedError = new Error(`The talk of id ${ctx.params.talkId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (talk.error) {
        const explainedError = new Error(talk.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = talk;
});

router.delete('/:talkId', async (ctx) => {
    const deletedTalk = await deleteOne(ctx.params.talkId);

    if (!deletedTalk.id) {
        const explainedError = new Error(`The organization of id ${ctx.params.talkId} does not exist.`);
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedTalk.error) {
        const explainedError = new Error(deletedTalk.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedTalk;
});

router.put('/:talkId', async (ctx) => {
    const updatedTalk = await updateOne(ctx.params.talkId, ctx.request.body);

    if (updatedTalk.error) {
        const explainedError = new Error(updatedTalk.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedTalk.id) {
        const explainedError = new Error(
            `The tag of id ${ctx.params.talkId} does not exist, so it could not be updated`,
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedTalk;
});

module.exports = router;
