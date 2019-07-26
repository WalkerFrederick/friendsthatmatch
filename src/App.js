import React from 'react';
import { Provider, connect } from 'react-redux'
import { updateAuthIn, updateAuthOut } from './actions/authActions'
import store from './store'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import firebase from 'firebase'


import CreateAccount from './pages/CreateAccount'
import LoginAccount from './pages/loginAccount'
import Home from './pages/Home'

import AuthHelper from './components/AuthHelper'
import PrivateRoute from './components/PrivateRoute'

import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'

import './App.css'


var auth = firebase.auth();


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userSignedIn: false
    };
  }
  

  render() {
    return (
      <Provider store={store}>
        <Router>
          <AuthHelper></AuthHelper>
        </Router>
      </Provider>
    )
  }
}

export default App;
