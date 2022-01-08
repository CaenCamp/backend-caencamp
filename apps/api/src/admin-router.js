const Router = require('koa-router');

const editionRouter = require('./edition/router');
const editionCategoryRouter = require('./edition/category-router');
const editionModeRouter = require('./edition/mode-router');
const jobPostingRouter = require('./job-posting/router');
const organizationRouter = require('./organization/router');
const placeRouter = require('./place/router');
const speakerRouter = require('./speaker/router');
const tagRouter = require('./tag/router');
const talkRouter = require('./talk/router');
const talkTypeRouter = require('./talk/type-router');
const tokenRouter = require('./post-token/router');
const websiteRouter = require('./website/router');
const websiteTypeRouter = require('./website/type-router');

const router = new Router({
    prefix: '/api-admin',
});

router.use(async (ctx, next) => {
    if (!ctx.state.jwt) {
        ctx.throw(401, 'Admin API is no public. You must log in.');

        return;
    }

    await next();
});

router.use(editionRouter.routes()).use(editionRouter.allowedMethods());
router.use(editionCategoryRouter.routes()).use(editionCategoryRouter.allowedMethods());
router.use(editionModeRouter.routes()).use(editionModeRouter.allowedMethods());
router.use(jobPostingRouter.routes()).use(jobPostingRouter.allowedMethods());
router.use(organizationRouter.routes()).use(organizationRouter.allowedMethods());
router.use(placeRouter.routes()).use(placeRouter.allowedMethods());
router.use(speakerRouter.routes()).use(speakerRouter.allowedMethods());
router.use(tagRouter.routes()).use(tagRouter.allowedMethods());
router.use(talkRouter.routes()).use(talkRouter.allowedMethods());
router.use(talkTypeRouter.routes()).use(talkTypeRouter.allowedMethods());
router.use(tokenRouter.routes()).use(tokenRouter.allowedMethods());
router.use(websiteRouter.routes()).use(websiteRouter.allowedMethods());
router.use(websiteTypeRouter.routes()).use(websiteTypeRouter.allowedMethods());

module.exports = router;
