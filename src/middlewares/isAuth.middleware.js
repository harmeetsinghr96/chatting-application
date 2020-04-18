/* Importing a JWT package */
const jwt = require("jsonwebtoken");

/* creating a middleware function */
const authMiddleware = (req, res, next) => {
  
    try {
  
        var token = req.headers.authorization.split(" ")[1];
        var authUser = jwt.verify(token, process.env.JWT_KEY);

        req.user = authUser;

        next();
  
    } catch (error) {

        res.status(401).json({
            status: "401",
            message: 'Unauthenticated'
        });

    }

}

module.exports = authMiddleware;