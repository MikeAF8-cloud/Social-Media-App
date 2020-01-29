import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import MyButton from './MyButton';
import PostPost from '../posts/PostPost';
import Notifications from './Notifications';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';

import HomeIcon from '@material-ui/icons/Home';

const Navbar = (props) => {
    const { authenticated } = props;

    return (
        <AppBar position="fixed">
            <Toolbar className="nav-container">
                {authenticated ? (
                    <React.Fragment>
                        <PostPost />
                        <Link to= "/">
                            <MyButton tip="Go to home page">
                                <HomeIcon color="primary" />
                            </MyButton> 
                        </Link>
                            <Notifications />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </React.Fragment>
                )
                }

            </Toolbar>
        </AppBar>
    )
}

Navbar.propTypes = {
    authenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar)