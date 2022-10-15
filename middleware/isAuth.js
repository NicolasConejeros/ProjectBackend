const jwt = require('jsonwebtoken');

const { SECRET_TOKEN } = process.env;

module.exports = (request, response, next) => {
    const authorization = request.get('authorization');
    let token = '';
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }

    let decodedToken = {};
    try {
        decodedToken = jwt.verify(token, SECRET_TOKEN);
    } catch (error) {
        return next(error);
    }

    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid',
        });
    }
    const { id: userId, email: email } = decodedToken;
    request.userId = userId;
    request.email = email;

    return next();
};
