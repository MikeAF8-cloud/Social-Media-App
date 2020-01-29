import React, { useEffect } from 'react'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Post from '../components/posts/Post';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../components/posts/PostSkeleton';

import { getPosts } from '../redux/actions/dataActions'

const Home2 = (props) => {
    const { posts, loading } = props.data;
    const { getPosts } = props;

    useEffect(() => {
        getPosts();
    }, []);

    let recentScreamMarkup = !loading ? (
        posts.map(post => (
            <Post key={post.postId} post={post} />)
        )
    ) : (
        <PostSkeleton />
    );
    

    return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {recentScreamMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <Profile/>
            </Grid>
        </Grid>
    )
}

Home2.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, { getPosts })(Home2);