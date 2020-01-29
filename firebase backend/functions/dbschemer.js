let db = {
    users: [
        {    
            userId: "hdfjgdjhdgdfhidhgfdfgpdghp",
            email: "newUser@gmail.com",
            handle: "User",
            createdAt: new Date(),
            imageUrl: "image/husdbk/sdfsdkjfsdf",
            bio: "Hello, my name is user, nice to meet you",
            website: "https://user.com",
            location: "London, UK"
        }
    ],
    posts: [
        {
            userHandle: "user",
            body: "This is the user body",
            createdAt: "2019-09-12T01:52:34.024Z",
            likeCount: 5,
            commentCount: 2
        },
    ],
    comments: [
        {
            userHandle: "user",
            postId: "shdskdjkjsfuisfudsh",
            body: "Nice one mate!",
            createdAt: new Date()
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            postId: 'fdigisodhsfafpjods',
            type: 'like | comment',
            createdAt: 'new Date().toISOString()'
        }
    ]
};

const userDetails = {
    //Redux
    credentials: {
        userId: "AFSD7ASGOD7EWDGWED8ADDA",
        email: "userF@email.com",
        handle: "userF",
        createdAt: new Date(),
        imageUrl: "image/hsdkfsdf",
        bio: "Hello, my name is userF, nice to meet you",
        website: "https://user.com",
        location: "London, UK"
    },
    likes: [
        {
            userHandle: "userF",
            postId: "skdhf8qt7dweify"
        },
        {
            userHandle: "userF",
            postId: "wgy687398yq8o"
        }
    ]
}