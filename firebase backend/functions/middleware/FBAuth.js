const { db, admin } = require('../utils/admin');

module.exports.FBAuth = (req, res, next) => {
    if (req.headers.authorization 
     && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log("No token found");
        return res.status(403).json({
            error: "Unauthorized Request"
        });
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users')
            .where("userId", '==', req.user.uid)
            .limit(1)
            .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data().handle;
        req.user.imageUrl = data.docs[0].data().imageUrl;
        return next();
    })
    .catch(err => {
        console.log("Error while verifying token", err);
        return res.status(403).json({
            error: `Not a valid token: ${err}`
        });
    });
}