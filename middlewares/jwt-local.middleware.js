const jwtService = require('../services/jwt.service');
const errorHandler = require('../services/error-handler.service');
const sendJson = require('../services/response.service');

module.exports = {
    verifyToken: async(req, res, next) => {
        try {
            const token = req.headers['x-local-token'];
            if (!token) {
                res.status(401);
                return sendJson({
					res,
					success: false,
					msg: 'no verifying local token',
					code: 401,
				});
            }
            const decoded = await jwtService.verifyLocalToken(token);
            req.decoded = decoded;
            return next();
        } catch(err) {
            errorHandler(err, req, res);
        }
    }
}