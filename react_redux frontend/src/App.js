import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

import NavBar from './components/layout/Navbar';
import AuthRoute from './components/layout/AuthRoute';

import Home2 from "./pages/home"
import Signup from "./pages/signup";
import Login from "./pages/login";
import User from './pages/user';

import ThemeFile from './util/theme';
import axios from 'axios';

const theme = createMuiTheme(ThemeFile);

const token = localStorage.FBIdToken;
if(token) {
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
              <NavBar></NavBar>
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home2} />
                  <AuthRoute exact path="/login" component={Login} />
                  <AuthRoute exact path="/signup" component={Signup} />
                  <Route exact path='/users/:handle' component={User} />
                  <Route exact path='/users/:handle/scream/:screamId' component={User}/>
                </Switch>
              </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
