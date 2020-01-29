const { admin, db } = require('../utils/admin');
const { firebase, firebaseApp} = require('../init/initFirebase');
const { isEmpty, isEmail } = require('../utils/funcs/validators');
const { validateSignUp, validateLogin, reduceUserDetails } = require('../utils/funcs/validators');
const { config } = require('../utils/config');

// Signup new user
exports.signUp = (req, res) => {
    
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    //Check for Validation
    const { valid, errors } = validateSignUp(newUser);
    if (!valid) {
        return res.status(400).json(errors);
    }

    // Validate Data
    const user = db.doc(`users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists) {
            return res.status(400).json({
                handle: "This handle is already taken"
            });
        } else {
            return (firebase.auth()
                .createUserWithEmailAndPassword(
                    newUser.email, 
                    newUser.password)
                );
        }
    })
    .then(data => {
        return Promise.all([
            data.user.getIdToken(), 
            data.user.uid
        ]);
    })
    .then(([token, userId]) => {
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/blank-profile-picture.png?alt=media`,
            userId: userId
        };
        return Promise.all([db.doc(`/users/${newUser.handle}`)
                .set(userCredentials), token]);
    })
    .then(([data, token]) => {
        return res.status(201).json({
            token: token
        });
    })
    .catch(err => {
        console.error(err);
        switch(err.code) {
            case "auth/email-already-in-use":
                return res.status(400).json({
                    email: "Email is already in use"
                });
            default:
                return res.status(500).json({
                    general: `Something went wrong. Please try again. ${err.code}`
                });
        }
    });
};


// Login existing user
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    //Check for Validation
    const { valid, errors } = validateLogin(user);
    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({
            token
        });
    })
    .catch(err => {
        console.log(err);
        switch(err.code) {
            case "auth/wrong-password":
                return res.status(403).json({
                    general: `Invalid email or password. Please try again`
                });
            case "auth/user-not-found":
                return res.status(403).json({
                    general: `Invalid email or password. Please try again`
                });
            default:
                return res.status(500).json({
                    error: `Something went wrong. Please try again. ${err.code}`
                });
        }
    })
};

// Add user details
module.exports.addUserDetails = (req, res) => {
   const userDetails = reduceUserDetails(req.body); 
    
   db.doc(`/users/${req.user.handle}`).update(userDetails)
   .then(() => {
       return res.status(201).json({
           message: "Details added successfully"
       });
   })
   .catch(err => {
       console.log(err);
       return res.status(500).json({
           error: `Could not add details: ${err.code}`
       });
   });
}

//Get another user's details
module.exports.getUserDetails = (req, res) => {
    let userData = {};

    db.doc(`/users/${req.params.handle}`).get()
    .then(doc => {
        if(doc.exists){
            userData.user = doc.data();
            return db.collection(`posts`)
            .where('userHandle', '==', req.params.handle)
            .orderBy('createdAt', 'desc')
            .get()
        } else {
            return res.status(404).json({
                error: `User not found`
            });
        }
    })
    .then(data => {
        userData.posts = [];

        data.forEach(doc => {
            userData.posts.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                userHandle: doc.data().userHandle,
                userImage: doc.data().userImage,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                postId: doc.id
            });
        });

        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({
            error: `Error: ${err.code}`
        });
    });
};

//Get own user details
module.exports.getAuthUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
    .then(doc => {
        if(doc.exists) {
            userData.credentials = doc.data();
            return db.collection('likes')
            .where('userHandle', '==', req.user.handle)
            .get();
        }
    })
    .then(data => {
        userData.likes = [];
        data.forEach(doc => {
            userData.likes.push(doc.data());
        });
        
        return db.collection('notifications')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10).get();
    })
    .then(data => {
        userData.notifications = [];
        data.forEach(doc => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                createdAt: doc.data().createdAt,
                postId: doc.data().postId,
                type: doc.data().type,
                read: doc.data().read,
                notificationId: doc.id
            });
        })
        return res.json(userData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            error: `Error: ${err.code}`
        });
    });
}

//Upload a profile image for user
module.exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageFilename;
    let imageToBeUploaded;
    busboy.on('file', (fieldName, file, filename, encoding, mimetype) => {
       if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
           return res.status(400).json({
               error: "Wrong file type submitted"
           });
       }
       
        console.log(fieldName);
        console.log(filename);
        console.log(mimetype);

        const imageExtension = filename.split('.').pop();
        
        imageFilename = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);

        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        admin.storage()
        .bucket("social-media-app-42f08.appspot.com")
        .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl: imageUrl });
        })
        .then(() => {
            return res.status(201).json({
                message: "Image uploaded successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: `Error: ${err.code}`
            });
        });
    })
    busboy.end(req.rawBody);
};

// Changing notifications of user to read
module.exports.markNotificationsRead = (req, res) => {
    //Update multiple documents
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true});
    })
    batch.commit()
    .then(() => {
        return res.json({
            message: 'Notifications marked read'
        });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({
            error: `Error: ${err.code}`
        });
    });
}