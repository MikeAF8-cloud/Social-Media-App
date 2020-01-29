import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Typography, TextField, Button, CircularProgress } from '@material-ui/core';

import AppIcon from '../assets/images/f_logo.PNG';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.spreadIt
});

function Signup(props) {
    const { classes, UI: { loading } } = props;

    const reducer = (state, action) => {
        switch(action.type) {
            case 'SET_LOADING':
                return {loading: true}
            case 'SET_EMAIL':
                return {...state, email: action.payload};
            case 'SET_PASSWORD':
                return {...state, password: action.payload};
            case 'SET_CONFIRM_PASSWORD':
                return {...state, confirmPassword: action.payload};
            case 'SET_HANDLE':
                return {...state, handle: action.payload};
            case 'SET_ERRORS':
                if (action.payload === null) {
                    return state;
                } else {
                    return {...state, errors: action.payload};
                }
            default:
                return state;
        };
    }

    const [state, dispatch] = useReducer(reducer, {
        email: '',
        password: '',
        confirmPassword: '',
        handle: '',
        errors: {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            general: ''
        }
    });
    
    useEffect(() => {
        dispatch({
            type: 'SET_ERRORS',
            payload: props.UI.errors
        });
    }, [props.UI.errors]);

    const onSubmit = (event) => {
        event.preventDefault();

        const newUserData = {
            email: state.email,
            password: state.password,
            confirmPassword: state.confirmPassword,
            handle: state.handle
        };
        props.signupUser(newUserData, props.history);
    }

    const onChange = (event) => {
        let dispatchType;
        switch(event.target.name) {
            case 'email':
                dispatchType = 'SET_EMAIL';
                break;
            case 'password':
                dispatchType = 'SET_PASSWORD';
                break;
            case 'confirmPassword':
                dispatchType = 'SET_CONFIRM_PASSWORD';
                break;
            case 'handle':
                dispatchType = 'SET_HANDLE';
                break;
            default: 
                break;
        } 
        dispatch({
            type: dispatchType,
            payload: event.target.value
        });
    }

    const { errors } = state;
    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
                <img src={AppIcon} alt="Ferrari logo" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Signup
                </Typography>
                <form noValidate onSubmit={onSubmit}>
                    <TextField 
                    id="email" 
                    name="email" 
                    type="email"
                    helperText={errors.email}
                    error={errors.email ? true : false}
                    value={state.email}
                    label="Email" 
                    className={classes.textField}
                    onChange={onChange}
                    fullWidth />
                    
                    <TextField 
                    id="password" 
                    name="password" 
                    type="password"
                    value={state.password}
                    helperText={errors.password}
                    error={errors.password ? true : false}
                    label="Password" 
                    className={classes.textField}
                    onChange={onChange}
                    fullWidth />

                    <TextField 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password"
                    value={state.confirmPassword}
                    helperText={errors.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    label="Confirm Password" 
                    className={classes.textField}
                    onChange={onChange}
                    fullWidth />

                    <TextField 
                    id="handle" 
                    name="handle" 
                    type="text"
                    value={state.handle}
                    helperText={errors.handle}
                    error={errors.handle ? true : false}
                    label="Username" 
                    className={classes.textField}
                    onChange={onChange}
                    fullWidth />

                    {errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                    )}

                    <Button type="submit" variant="contained" 
                    color="primary" className={classes.button}
                    disabled={loading}>
                        Signup
                        {loading && (
                            <CircularProgress size={30}className={classes.progress}/>
                        )}
                    </Button>
                    <div>
                        <small>Already have an account? <Link to="/login">Login</Link></small>
                    </div>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    )
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(Signup));