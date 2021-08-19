const Router = require('koa-router');

const {
    getOne,
    getPaginatedList,
} = require('./public-repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const defaultQueryParameters = {
    currentPage: 1,
    orderBy: 'DESC',
    perPage: 50,
    sortBy: 'name',
};

const router = new Router({
    prefix: '/speakers',
});

router.get('/', async (ctx) => {
    const { speakers, pagination } = await getPaginatedList({
        ...defaultQueryParameters,
        ...ctx.query,
    });

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

router.get('/:speakerSlug', async (ctx) => {
    const speaker = await getOne(ctx.params.speakerSlug);

    if (speaker.error) {
        const explainedError = new Error(speaker.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!speaker.identifier) {
        const explainedError = new Error(
            `The speaker of identifier ${ctx.params.speakerSlug} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = speaker;
});

module.exports = router;
