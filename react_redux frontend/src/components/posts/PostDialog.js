import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import UnfoldMore from '@material-ui/icons/UnfoldMore';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';

import { getPost, clearErrors } from '../../redux/actions/dataActions';

import MyButton from '../layout/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

const styles = (theme) => ({
    ...theme.spreadIt,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%',
        bottom: '15%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
});

const PostDialog = (props) => {
    const [open, setOpen] = useState(false);
    const [path, setPath] = useState({
        oldPath: '',
        newPath: ''
    });
    
    useEffect(() => {
        if(props.openDialog) {
            onOpen();
        }
    }, []);

    const onOpen = () => {
        const { userHandle, postId } = props;

        let oldPath = window.location.pathname;
        const newPath = `/users/${userHandle}/post/${postId}`;

        if(oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }

        window.history.pushState(null, null, newPath);
        setOpen(true);
        setPath({
            oldPath,
            newPath
        });
        props.getPost(postId);
    };

    const onClose = () => {
        window.history.pushState(null, null, path.oldPath);
        setOpen(false);

        props.clearErrors();
    };

    const {
        classes,
        post: {
            postId,
            body,
            createdAt,
            likeCount,
            commentCount,
            userImage,
            userHandle,
            comments
        },
        UI: {
            loading
        }
    } = props;

    console.log(commentCount);
    const dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}>
            <CircularProgress size={200} thickness={2}/>
        </div>
    ) : (
        <Grid container spacing={2}>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage}/>
            </Grid>
            <Grid item sm={7}>
                <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
                    @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMM DD YYYY')}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography variant="body1">
                    {body}
                </Typography>
                <LikeButton postId={postId} />
                <span>{likeCount} Likes</span>
                <MyButton tip="Comments">
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{commentCount} Comments</span>
            </Grid>
            <hr className={classes.invisibleSeparator} />
            <CommentForm postId={postId} />
            <Comments comments={comments}/>
        </Grid>
    );

    return (
        <React.Fragment>
            <MyButton onClick={onOpen} tip="Expand post" tipClassName={classes.expandButton}>
                <UnfoldMore color="primary" />
            </MyButton>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <MyButton tip="Close" onClick={onClose} tipClassName={classes.closeButton}>
                    <CloseIcon color="secondary" />
                </MyButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

PostDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
});

const mapActionsToProps = {
    getPost,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog));