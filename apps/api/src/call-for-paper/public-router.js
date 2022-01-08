const Router = require('koa-router');

const { createOne } = require('./public-repository');

const router = new Router({
    prefix: '/papers',
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

module.exports = router;
