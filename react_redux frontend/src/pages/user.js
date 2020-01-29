import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

import Post from '../components/posts/Post';
import StaticProfile from '../components/profile/StaticProfile';
import PostSkeleton from '../components/posts/PostSkeleton';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

const User = (props) => {
    const { posts, loading } = this.props.data;

    const [state, setState] = useState({
        profile: null,
        postIdParam: null
    });

    useEffect(() => {
        const handle = props.match.params.handle;
        const postId = props.match.params.postId;

        if(postId) {
            setState({
                ...state,
                postIdParam: postId
            });
        }

        props.getUserData(handle);

        axios.get(`/user/${handle}`)
        .then(res => {
            setState({
                ...state,
                profile: res.data.user
            });
        })
        .catch(err => console.log(err));
    }, []);

    const postsMarkup = loading ? (
        <PostSkeleton />
    ) : posts === null ? (
        <p>No posts from this user</p>
    ) : !state.postIdParam ? (
        posts.map(post => <Post key={post.postId} post={post}/>)
    ) : (
        posts.map(post => {
            if(post.postId !== state.postIdParam) {
                return <Post key={post.postId} post={post}/>
            } else {
                return <Post key={post.postId} post={post} openDialog/>
            }
        })
    );

    return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {postsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <ProfileSkeleton />
                ) : (
                    <StaticProfile profile={state.profile}/>
                )}
            </Grid>
        </Grid>
    )
}

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
});


export default connect(mapStateToProps, { getUserData })(User);
