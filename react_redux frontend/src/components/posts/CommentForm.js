import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';

import { submitComment } from '../../redux/actions/dataActions';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    ...theme.spreadIt
});

const CommentForm = (props) => {
    const { classes, authenticated } = props;

    const [body, setBody] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(props.UI.errors) {
            setErrors(props.UI.errors);
        }
        if(!props.UI.errors && !props.UI.loading) {
            setBody('');
        }
    }, [props.UI.errors]);

    const onChange = event => {
        setBody(event.target.value);
    }

    const onSubmit = event => {
        event.preventDefault();

        props.submitComment(props.postId, { body: body });
    }

    const commentFormMarkup = authenticated ? (
        <Grid item sm={12} style={{ textAlign: 'center'}}>
            <form onSubmit={onSubmit}>
                <TextField 
                name="body" 
                type="text" 
                label="Comment on post" 
                error={errors.comment ? true : false}
                helperText={errors.comment}
                value={body}
                onChange={onChange}
                fullWidth
                className={classes.textField}
                />
                <Button type="submit" variant="contained"
                color="primary" className={classes.button}>
                    Submit
                </Button>
            </form>
            <hr className={classes.invisibleSeparator} />
        </Grid>
    ) : null;

    return commentFormMarkup;
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));