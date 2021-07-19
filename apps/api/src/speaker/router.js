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
    prefix: '/api/speakers',
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
    const { speakers, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/speakers',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = speakers;
});

router.post('/', async (ctx) => {
    const newSpeaker = await createOne(ctx.request.body);

    if (newSpeaker.error) {
        const explainedError = new Error(newSpeaker.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newSpeaker;
});

router.get('/:speakerId', async (ctx) => {
    const speaker = await getOne(ctx.params.speakerId);

    if (!speaker.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.speakerId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (speaker.error) {
        const explainedError = new Error(speaker.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = speaker;
});

router.delete('/:speakerId', async (ctx) => {
    const deletedSpeaker = await deleteOne(ctx.params.speakerId);

    if (!deletedSpeaker.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.speakerId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedSpeaker.error) {
        const explainedError = new Error(deletedSpeaker.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedSpeaker;
});

router.put('/:speakerId', async (ctx) => {
    const updatedSpeaker = await updateOne(
        ctx.params.speakerId,
        ctx.request.body
    );

    if (updatedSpeaker.error) {
        const explainedError = new Error(updatedSpeaker.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedSpeaker.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.speakerId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedSpeaker;
});

module.exports = router;
