import { 
    SET_POSTS,
    SET_POST, 
    LIKE_POST, 
    UNLIKE_POST, 
    LOADING_DATA,
    DELETE_POST,
    POST_POST,
    SUBMIT_COMMENT
} from '../types';

const intiState = {
    posts: [],
    post: {},
    loading: false
};

export default function(state=intiState, action) {
    switch(action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case SET_POST:
            return {
                ...state,
                post: action.payload
            }
        case LIKE_POST:
        case UNLIKE_POST:
            let unlikeIndex = state.posts.findIndex((post) => (
                post.postId === action.payload.postId
            ));
            state.posts[unlikeIndex] = action.payload;
            if(state.post.postId === action.payload.postId) {
                state.post = action.payload;
            }
            return {
                ...state
            };
        case DELETE_POST:
            const deleteIndex = state.posts.findIndex(post => {
                return post.postId === action.payload;
            });
            state.posts.splice(deleteIndex, 1);
            return {
                ...state
            };
        case POST_POST: 
            return {
                ...state,
                posts: [
                    action.payload,
                    ...state.posts
                ]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: [action.payload, ...state.post.comments]
                }
            }
        default:
            return state;
    }
}