const { getOne, updateOne } = require('../../post-token/repository');

const publicTokenMiddleware = async (ctx, next) => {
    const authorization = ctx.request.headers.authorization || '';
    const [prefix, token] = authorization.split(' ');
    if (prefix === 'Bearer') {
        try {
            const tokenFromDb = await getOne(token);
            if (!tokenFromDb.id) {
                const explainedError = new Error('Your token is not valid');
                explainedError.status = 403;

                throw explainedError;
            } else {
                await updateOne(token, { lastUseAt: new Date(), counter: tokenFromDb.counter + 1 });
            }
        } catch (error) {
            const explainedError = new Error('Error with your token');
            explainedError.status = 401;

            throw explainedError;
        }
    } else {
        const explainedError = new Error('Bad bad request');
        explainedError.status = 400;

        throw explainedError;
    }

    await next();
};

module.exports = publicTokenMiddleware;
