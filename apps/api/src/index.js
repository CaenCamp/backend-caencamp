const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const mount = require('koa-mount');
const { oas } = require('koa-oas3');
const error = require('koa-json-error');

const config = require('./config');

const authenticationRouter = require('./toolbox/authentication/router');
const dbMiddleware = require('./toolbox/middleware/db');
const jwtMiddleware = require('./toolbox/authentication/jwtMiddleware');

const adminRouter = require('./admin-router');
const publicRouter = require('./public-router');

const app = new Koa();

// Add keys for signed cookies
app.keys = [
    config.security.signedCookie.key1,
    config.security.signedCookie.key2,
];

// See https://github.com/zadzbw/koa2-cors for configuration
app.use(
    cors({
        origin: 'http://localhost:3000',
        allowHeaders: ['Origin, Content-Type, Accept, Authorization'],
        exposeHeaders: ['X-Total-Count', 'Link'],
        credentials: true,
    })
);

const router = new Router();
const env = process.env.NODE_ENV;

/**
 * This handler catch errors throw by oas middleware validation.
 *
 * @param {object} error - oas error
 * @throw {Error} reformated oas error
 */
const errorHandler = (error) => {
    let errorDetails = false;
    if (error.meta && error.meta.rawErrors) {
        errorDetails = error.meta.rawErrors.reduce((acc, rawError) => {
            return [...acc, rawError.error];
        }, []);
    }
    const updatedError = new Error(
        `${error.message}${errorDetails ? ` (${errorDetails.join(', ')})` : ''}`
    );
    updatedError.status = 400;

    throw updatedError;
};

/**
 * This method is used to format message return by the global error middleware
 *
 * @param {object} error - the catched error
 * @return {object} the content of the json error return
 */
const formatError = (error) => {
    return {
        status: error.status,
        message: error.message,
    };
};


app.use(jwtMiddleware);
app.use(bodyParser());
app.use(error(formatError));

if (env === 'development') {
    router.get('/admin', (ctx) => {
        ctx.body = {
            message:
                'Front is not serve here in dev environment. See documentation. API is available on /api endpoint.',
        };
    });
} else {
    app.use(mount('/admin', serve(`${__dirname}/../admin`)));
}
app.use(router.routes()).use(router.allowedMethods());

app.use(dbMiddleware);

app.use(authenticationRouter.routes()).use(
    authenticationRouter.allowedMethods()
);
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());

app.use(async(ctx, next) => {
    const mw = await oas({
        file: `${__dirname}/../openapi/openapi.json`,
        uiEndpoint: '/documentation',
        validatePaths: ['/api'],
        errorHandler,
        validateResponse: false,
    });
    return mw(ctx, next);
});
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

app.listen(config.port, () => global.console.log(`API started on port ${config.port}`));
