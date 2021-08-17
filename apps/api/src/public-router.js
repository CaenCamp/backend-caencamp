const Router = require('koa-router');

const eventRouter = require('./edition/public-router');
const placeRouter = require('./place/public-router');
const tagRouter = require('./tag/public-router');

const router = new Router({
    prefix: '/api',
});

router.use(eventRouter.routes()).use(eventRouter.allowedMethods());
router.use(placeRouter.routes()).use(placeRouter.allowedMethods());
router.use(tagRouter.routes()).use(tagRouter.allowedMethods());

module.exports = router;
