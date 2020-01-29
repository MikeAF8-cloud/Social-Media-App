import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { postPost, clearErrors } from '../../redux/actions/dataActions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import MyButton from '../layout/MyButton';

const styles = (theme) => ({
    ...theme.spreadIt,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: '20'
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
});

const PostPost = (props) => {
    const { classes, UI: { loading }} = props;

    const initState = {
        open: false,
        body: '',
        errors: {}
    };

    const reducer = (state, action) => {
        switch(action.type) {
            case 'SET_OPEN':
                return {...state, open: action.payload};
            case 'SET_BODY':
                return {...state, body: action.payload};
            case 'SET_ERRORS':
                if (action.payload === null) {
                    return state;
                } else {
                    return {...state, errors: action.payload};
                }
            case 'RESET':
                return initState;
            default:
                return state;
        };
    }

    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        if(props.UI.errors){
            dispatch({
                type: 'SET_ERRORS',
                payload: props.UI.errors
            });
        }
        if(!props.UI.errors && !props.UI.loading) {
            dispatch({
                type: "RESET"
            });
        }
    }, [props.UI.errors])

    const onOpen = () => {
        dispatch({
            type: 'SET_OPEN',
            payload: true
        });
    }

    const onClose = () => {
        props.clearErrors();
        dispatch({
            type: 'SET_OPEN',
            payload: false
        });
        dispatch({
            type: 'SET_ERRORS',
            payload: {}
        });
    }

    const onChange = (event) => {
        dispatch({
            type: 'SET_BODY',
            payload: event.target.value
        });
    }

    const onSubmit = (event) => {
        event.preventDefault();

        props.postPost({
            body: state.body
        });
    }

    const { errors } = state;
    return (
        <React.Fragment>
            <MyButton onClick={onOpen} tip="Post post!">
                <AddIcon />
            </MyButton>
            <Dialog open={state.open} onClose={onClose} fullWidth maxWidth="sm">
                <MyButton tip="Close" onClick={onClose} tipClassName={classes.closeButton}>
                    <CloseIcon color="secondary" />
                </MyButton>
                <DialogTitle>
                    Post a new post
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={onSubmit}>
                        <TextField name="body" type="text" label="Post!" 
                            multiline rows="3" placeholder="Post something" 
                            error={errors.body ? true : false}
                            helperText={errors.body} className={classes.textField} 
                            onChange={onChange}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary"
                        className={classes.submitButton} disabled={loading}>
                            Submit
                            {loading && (
                                <CircularProgress 
                                    size={30} 
                                    className={classes.progressSpinner} 
                                />)}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

PostPost.propTypes = {
    postPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI
});

export default connect(mapStateToProps, { postPost, clearErrors })(withStyles(styles)(PostPost));