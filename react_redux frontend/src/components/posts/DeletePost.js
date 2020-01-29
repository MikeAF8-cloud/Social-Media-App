import React, { useState } from 'react'
import PropTypes from 'prop-types';

import MyButton from '../layout/MyButton';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    deleteButton: {
        position: 'absolute',
        top: '10%',
        left: '90%'
    }
});

const DeletePost = (props) => {
    const { classes, postId } = props;

    const [open, setOpen] = useState(false);
    
    const onOpen = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }

    const deletePost = () => {
        props.deletePost(postId);
        setOpen(false);
    }

    return (
        <React.Fragment>
            <MyButton tip="Delete Post" onClick={onOpen} btnClassName={classes.deleteButton}>
                <DeleteOutline color="secondary" />
            </MyButton>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Are you sure you want to delete the post?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deletePost} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

DeletePost.propTypes = {
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

export default connect(null, { deletePost })(withStyles(styles)(DeletePost));