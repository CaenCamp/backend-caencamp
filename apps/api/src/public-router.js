const Router = require('koa-router');

const tagRouter = require('./tag/public-router');

const router = new Router({
    prefix: '/api',
});

router.use(tagRouter.routes()).use(tagRouter.allowedMethods());

module.exports = router;
