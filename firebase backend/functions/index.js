const functions = require('firebase-functions');

const cors = require('cors');

const app = require('express')();
app.use(cors());

const { db } = require('./utils/admin'); 
const { FBAuth } = require('./middleware/FBAuth');

//Post Routes
const { 
    getPosts, 
    postPost, 
    getPost, 
    commentOnPost, 
    likePost, 
    unlikePost,
    delPost 
} = require('./handlers/posts');

app.get('/posts', getPosts);
app.post('/post', FBAuth, postPost);
app.get('/post/:postId', getPost);
app.delete('/post/:postId', FBAuth, delPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);

// Signup & login routes
const { 
    signUp, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthUser,
    getUserDetails, 
    markNotificationsRead
} = require('./handlers/users');

app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region("us-central1").https.onRequest(app);

//Creates a notification to user when another user like your post
exports.createNotificatonOnLike = functions.region("us-central1")
.firestore.document(`likes/{id}`)
.onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`).get()
    .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'like',
                read: false,
                postId: doc.id
            });
        }
    })
    .catch(err => {
        console.error(err);
    });
});

// Deletes a notification of a user that liked your post 
exports.deleteNotificatonOnLike = functions.region("us-central1")
.firestore.document(`likes/{id}`)
.onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(err => {
        console.error(err);
    });
});

exports.createNotificatonOnComment = functions.region("us-central1")
.firestore.document(`comments/{id}`)
.onCreate((snapshot) => {  
    db.doc(`/posts/${snapshot.data().postId}`).get()
    .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                postId: doc.id
            });
        }
    })
    .catch(err => {
        console.error(err);
        return;
    });
});

exports.onUserImageChange = functions.region("us-central1")
.firestore.document(`users/{userId}`)
.onUpdate((change) => {    
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
        console.log('Image has changed');
        
        const batch = db.batch();
        return db.collection('posts')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
            data.forEach(doc => {
                const post = db.doc(`/posts/${doc.id}`);
                batch.update(post, {
                    userImage: change.after.data().imageUrl
                });
            })
            return batch.commit();
        })
        .catch(err => {
            console.error(err);
            return true;
        });
    } else {
        return false;
    }
});

module.exports.onPostDelete = functions.region("us-central1")
.firestore.document(`posts/{postId}`)
.onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();

    return db.collection('comments')
    .where('postId', '==', postId)
    .get()
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/comments/${doc.id}`));
        });

        return db.collection('likes')
        .where('postId', '==', postId)
        .get();
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db.collection('notifications')
        .where('postId', '==', postId)
        .get();
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
    })
    .catch(err => {
        console.error(err);
        return false;
    });
});