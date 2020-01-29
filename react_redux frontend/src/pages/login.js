import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Typography, TextField, Button, CircularProgress } from '@material-ui/core';

import AppIcon from '../assets/images/f_logo.PNG';

import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.spreadIt
});
console.log(styles);

const Login = (props) => {
    const { classes, UI: { loading } } = props;

    const reducer = (state, action) => {
        switch(action.type) {
            case 'SET_EMAIL':
                return {...state, email: action.payload};
            case 'SET_PASSWORD':
                return {...state, password: action.payload};
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
        errors: {
            email: '',
            password: '',
            general: ''
        }
    });
    
    useEffect(() => {
        dispatch({
            type: 'SET_ERRORS',
            payload: props.UI.errors
        })
    }, [props.UI.errors]);

    const onSubmit = (event) => {
        event.preventDefault();

        props.loginUser({
            email: state.email,
            password: state.password
        }, props.history);
    };

    const onChange = (event) => {
        let dispatchType;
        if(event.target.name === 'email') {
            dispatchType = 'SET_EMAIL';
        }
        else if (event.target.name === 'password') {
            dispatchType = 'SET_PASSWORD'
        }
 
        dispatch({
            type: dispatchType,
            payload: event.target.value
        });
    }

    const { errors } = state;
    
    console.log(classes.palette);
    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm className={classes.grid}>
                <img src={AppIcon} alt="Ferrari logo" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={onSubmit}>
                    <TextField 
                    id="email" 
                    name="email" 
                    type="email"
                    helperText={state.errors.email}
                    error={state.errors.email ? true : false}
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
                    error={state.errors.password ? true : false}
                    label="Password" 
                    className={classes.textField}
                    onChange={onChange}
                    fullWidth />
                
                    {state.errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {state.errors.general}
                        </Typography>
                    )}

                    <Button type="submit" variant="contained" 
                    color="primary" className={classes.button}
                    disabled={loading}>
                        Login
                        {loading && (
                            <CircularProgress size={30}className={classes.progress}/>
                        )}
                    </Button>
                    <div>
                        <small>Don't have an account? <Link to="/signup">Sign Up</Link></small>
                    </div>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    )
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));