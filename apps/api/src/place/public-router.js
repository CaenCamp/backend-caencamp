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
    perPage: 10,
    sortBy: 'name',
};

const router = new Router({
    prefix: '/places',
});

router.get('/', async (ctx) => {
    const { places, pagination } = await getPaginatedList({
        ...defaultQueryParameters,
        ...ctx.query,
    });

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/places',
        pagination,
    });

    ctx.set('X-Total-Count', parseInt(pagination.total, 10));
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = places;
});

router.get('/:placeSlug', async (ctx) => {
    const place = await getOne(ctx.params.placeSlug);

    if (!place.identifier) {
        const explainedError = new Error(
            `The place of identifier ${ctx.params.placeSlug} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (place.error) {
        const explainedError = new Error(place.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = place;
});

module.exports = router;
