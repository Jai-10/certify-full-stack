const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt_token

    if (token) {    // check if token exists
        // check if token is verified
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "Access denied." }).redirect('/login');
                return;
            }
            else {
                // console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.status(401).redirect('/login');
    }    
}


module.exports = authenticateToken;