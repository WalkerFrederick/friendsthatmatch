import React from 'react';
import { Provider, connect } from 'react-redux'
import { updateAuthIn, updateAuthOut } from '../actions/authActions'
import store from '../store'
import { BrowserRouter as Router, Route, withRouter, Redirect, Switch } from 'react-router-dom';

import firebase from 'firebase'


import CreateAccount from '../pages/CreateAccount'
import LoginAccount from '../pages/loginAccount'
import Home from '../pages/Home'

import PrivateRoute from './PrivateRoute'
import AuthHelper from './AuthHelper'

import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter } from '@ionic/react'

class AppRouter extends React.Component {

  constructor(props) {
    super(props);
    
  }
  

  render() {
    
    return (<>
      <AuthHelper/>
    </>
     
    )
  }
}


export default withRouter(AppRouter);
