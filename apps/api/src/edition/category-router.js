const Router = require('koa-router');

const {
    deleteOne,
    createOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./category-repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/edition-categories',
});


router.get('/', async (ctx) => {
    const { categories, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/edition-categories',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = categories;
});

router.post('/', async (ctx) => {
    const newCategory = await createOne(ctx.request.body);

    if (newCategory.error) {
        const explainedError = new Error(newCategory.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newCategory;
});

router.get('/:categoryId', async (ctx) => {
    const category = await getOne(ctx.params.categoryId);

    if (!category.id) {
        const explainedError = new Error(
            `The category of id ${ctx.params.categoryId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (category.error) {
        const explainedError = new Error(category.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = category;
});

router.delete('/:categoryId', async (ctx) => {
    const deletedCategory = await deleteOne(ctx.params.categoryId);

    if (!deletedCategory.id) {
        const explainedError = new Error(
            `The talk types of id ${ctx.params.categoryId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedCategory.error) {
        const explainedError = new Error(deletedCategory.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedCategory;
});

router.put('/:categoryId', async (ctx) => {
    const updatedCategory = await updateOne(
        ctx.params.categoryId,
        ctx.request.body
    );

    if (updatedCategory.error) {
        const explainedError = new Error(updatedCategory.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedCategory.id) {
        const explainedError = new Error(
            `The category of id ${ctx.params.categoryId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedCategory;
});

module.exports = router;
