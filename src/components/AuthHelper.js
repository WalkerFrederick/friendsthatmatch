import React from 'react';
import { Provider, connect } from 'react-redux'
import { updateAuthIn, updateAuthOut } from '../actions/authActions'
import store from '../store'
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom';

import firebase from 'firebase'


import CreateAccount from '../pages/CreateAccount'
import LoginAccount from '../pages/loginAccount'
import Home from '../pages/Home'

import PrivateRoute from './PrivateRoute'

import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'



var auth = firebase.auth();


class AuthHelper extends React.Component {

  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(this.props.auth)
      if (user) {
          this.props.updateAuthIn()
        
      } else {
        console.log("ERROR")
        this.props.updateAuthOut()
      }
      console.log(this.props.auth)

    });
  }
  

  render() {
    
    return (<>
      <div className="App">
        {console.log(this.props.auth)}
            <IonApp>
            <IonReactRouter>
            <IonPage id="main">
              <IonRouterOutlet>
              <Route exact path="/createaccount" component={CreateAccount} />
              <Route exact path="/login" component={LoginAccount} />
              <Route path="/" render={(props) => (
                this.props.auth === true
                  ? <Home />
                  : <Redirect to='/createaccount' />
              )} />
              </IonRouterOutlet>
            </IonPage>
            </IonReactRouter>
            </IonApp>
          </div>
    </>
     
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, { updateAuthIn, updateAuthOut })(AuthHelper));
