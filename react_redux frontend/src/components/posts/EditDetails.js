import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';

import MyButton from '../layout/MyButton';

const styles = (theme) => ({
    ...theme.spreadIt,
    editButton: {
        float: 'right',
        display: 'hidden'
    }
});

const EditDetails = (props) => {
    const { credentials, classes } = props;

    const reducer = (state, action) => {
        switch(action.type) {
            case 'SET_BIO':
                return {...state, bio: action.payload};
            case 'SET_WEBSITE':
                return {...state, website: action.payload};
            case 'SET_LOCATION':
                return {...state, location: action.payload};
            case 'SET_OPEN':
                return {...state, open: action.payload};
            default:
                return state;
        };
    }

    const [state, dispatch] = useReducer(reducer, {
        bio: '',
        website: '',
        location: '',
        open: false
    });

    useEffect(() => {
        mapUserDetailsToState(credentials);
    }, []) ;

    const mapUserDetailsToState = (credentials) => {
        dispatch({
            type: 'SET_BIO',
            payload: credentials.bio ? credentials.bio : ''
        });
        dispatch({
            type: 'SET_WEBSITE',
            payload: credentials.website ? credentials.website : ''
        });
        dispatch({
            type: 'SET_LOCATION',
            payload: credentials.location ? credentials.location : ''
        });
    }
    
    const onOpen = () => {
        dispatch({
            type: 'SET_OPEN',
            payload: true
        });

        mapUserDetailsToState(props.credentials);
    }

    const onClose = () => {
        dispatch({
            type: 'SET_OPEN',
            payload: false
        });
    }

    const onChange = (event) => {
        let dispatchType;
        switch(event.target.name) {
            case 'bio':
                dispatchType = 'SET_BIO';
                break;
            case 'website':
                dispatchType = 'SET_WEBSITE';
                break;
            case 'location':
                dispatchType = 'SET_LOCATION';
                break;
            default:
                break;
        }

        dispatch({
            type: dispatchType,
            payload: event.target.value
        });
    }

    const onSubmit = () => {
        const userDetails = {
            bio: state.bio,
            website: state.website,
            location: state.location
        };

        props.editUserDetails(userDetails);
        onClose();
    }

    return (
        <React.Fragment>
            <MyButton tip="Edit Details" onClick={onOpen} tipClassName={classes.editButton}>
                <EditIcon color="primary" />
            </MyButton>
            <Dialog open={state.open} onClose={onClose} fullWidth maxWidth="sm" >
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField 
                            name="bio" 
                            type="text" 
                            label="Bio" 
                            multiline rows="3" 
                            placeholder="A short bio about yourself"
                            className={classes.TextField}
                            value={state.bio}
                            onChange={onChange} 
                        />
                        <TextField 
                            name="website" 
                            type="text" 
                            label="Website" 
                            placeholder="Your personal/professional website"
                            className={classes.TextField}
                            value={state.website}
                            onChange={onChange} 
                        />
                        <TextField 
                            name="location" 
                            type="text" 
                            label="Location" 
                            placeholder="City or town you reside in"
                            className={classes.TextField}
                            value={state.location}
                            onChange={onChange} 
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));