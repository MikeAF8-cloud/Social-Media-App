import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import MyButton from '../layout/MyButton';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikeButton from './LikeButton';

import ChatIcon from '@material-ui/icons/Chat';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 150,
        objectFit: 'cover'
    },
    content: {
        padding: 25
    }

}
const Post = (props) => {
    dayjs.extend(relativeTime);

    const { 
        classes, 
        post : { body, createdAt, userImage, 
            userHandle, postId, likeCount, commentCount },
        user: {
            authenticated,
            credentials: { handle }
        }
    } = props;
    
    const deleteButton = authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
    ) : null;
    
    
    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile Image" color="primary" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" component={Link} to={`/users/${userHandle}`}>
                    {userHandle}
                </Typography>
                {deleteButton}
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).fromNow()}
                </Typography>
                
                <Typography variant="body1">
                    {body}
                </Typography>
                <LikeButton postId={postId} />
                <span>{likeCount} Likes</span>
                <MyButton tip="Comments">
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{commentCount} Comments</span>
            </CardContent>
            <PostDialog postId={postId} userHandle={userHandle} openDialog={props.openDialog}/>
        </Card>
    );
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));