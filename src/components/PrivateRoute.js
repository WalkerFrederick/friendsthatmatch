import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase'

import CreateAccount from '../pages/CreateAccount'
import LoginAccount from '../pages/loginAccount'
import Home from '../pages/Home'

import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'


var auth = firebase.auth();

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userSignedIn: false
    };
  }


  render() {
    return (
        <>
        </>
    )
  }
}

export default PrivateRoute;
