import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';

import MyButton from '../layout/MyButton';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const LikeButton = (props) => {
    const { user: {
        authenticated
    } } = props;

    const likedPost = () => {
        if (props.user.likes && 
                props.user.likes.find(like => (
                    like.postId === props.postId
                    )
                )
            ) 
        {
            return true;
        } else {
            return false;
        }
    };
    
    const likePost = () => {
        props.likePost(props.postId);
    }
    
    const unlikePost = () => {
        props.unlikePost(props.postId);
    }
    
    const likeButton = !authenticated ? (
        <Link to="/login">
            <MyButton tip="Like">
                <FavoriteBorder color="primary" />
            </MyButton>
        </Link>
    ) : (
        likedPost() ? (
            <MyButton tip="Unlike" onClick={unlikePost}>
                <FavoriteIcon color="primary" />
            </MyButton>
        ) : <MyButton tip="Like" onClick={likePost}>
                <FavoriteBorder color="primary" />
            </MyButton>
    );
    
    return likeButton;
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    likePost,
    unlikePost
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)