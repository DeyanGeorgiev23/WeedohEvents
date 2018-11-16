import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Auth from './Auth';

import LandingPage from '../LandingPage';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import Dashboard from '../Dashboard/Dashboard';
import Validate from '../Common/Validate';



export default class Routes extends Component {
  render() {
    return ( 
      <Switch>
        <Route exact path='/' component={LandingPage}/>
        <Route exact path='/validate' component={Validate}/>
        {!Auth.isUserAuthenticated() ? <Route exact path='/signup' component={SignUp}/> : null}
        {!Auth.isUserAuthenticated() ? <Route exact path='/signin' component={SignIn}/> : null}
        {Auth.isUserAuthenticated() ? <Route exact path='/dashboard' component={Dashboard}/> : null}
        <Route path='*' exact={true} component={LandingPage} />
      </Switch>
        
    );
  }
}


