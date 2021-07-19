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
    prefix: '/api/places',
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
    const { places, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/places',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = places;
});

router.post('/', async (ctx) => {
    const newPlaces = await createOne(ctx.request.body);

    if (newPlaces.error) {
        const explainedError = new Error(newPlaces.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newPlaces;
});

router.get('/:placeId', async (ctx) => {
    const place = await getOne(ctx.params.placeId);

    if (!place.id) {
        const explainedError = new Error(
            `The place of id ${ctx.params.placeId} does not exist.`
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

router.delete('/:placeId', async (ctx) => {
    const deletedPlace = await deleteOne(ctx.params.placeId);

    if (!deletedPlace.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.placeId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedPlace.error) {
        const explainedError = new Error(deletedPlace.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedPlace;
});

router.put('/:placeId', async (ctx) => {
    const updatedPlace = await updateOne(
        ctx.params.placeId,
        ctx.request.body
    );

    if (updatedPlace.error) {
        const explainedError = new Error(updatedPlace.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedPlace.id) {
        const explainedError = new Error(
            `The speaker of id ${ctx.params.placeId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedPlace;
});

module.exports = router;
