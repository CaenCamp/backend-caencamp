const Router = require('koa-router');

const editionRouter = require('./edition/router');
const editionCategoryRouter = require('./edition/category-router');
const editionModeRouter = require('./edition/mode-router');
const jobPostingRouter = require('./job-posting/router');
const organizationRouter = require('./organization/router');
const paperRouter = require('./call-for-paper/router');
const placeRouter = require('./place/router');
const speakerRouter = require('./speaker/router');
const tagRouter = require('./tag/router');
const talkRouter = require('./talk/router');
const talkTypeRouter = require('./talk/type-router');
const tokenRouter = require('./post-token/router');
const websiteRouter = require('./website/router');
const websiteTypeRouter = require('./website/type-router');

const importedOrgRouter = require('./importation/org-router');
const nafRouter = require('./importation/naf-router');
const staffingRouter = require('./importation/staffing-router');
const legalRouter = require('./importation/legal-router');

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
router.use(paperRouter.routes()).use(paperRouter.allowedMethods());
router.use(placeRouter.routes()).use(placeRouter.allowedMethods());
router.use(speakerRouter.routes()).use(speakerRouter.allowedMethods());
router.use(tagRouter.routes()).use(tagRouter.allowedMethods());
router.use(talkRouter.routes()).use(talkRouter.allowedMethods());
router.use(talkTypeRouter.routes()).use(talkTypeRouter.allowedMethods());
router.use(tokenRouter.routes()).use(tokenRouter.allowedMethods());
router.use(websiteRouter.routes()).use(websiteRouter.allowedMethods());
router.use(websiteTypeRouter.routes()).use(websiteTypeRouter.allowedMethods());

router.use(importedOrgRouter.routes()).use(importedOrgRouter.allowedMethods());
router.use(nafRouter.routes()).use(nafRouter.allowedMethods());
router.use(staffingRouter.routes()).use(staffingRouter.allowedMethods());
router.use(legalRouter.routes()).use(legalRouter.allowedMethods());

module.exports = router;
