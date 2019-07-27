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

import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'



var auth = firebase.auth();


const LoginRequiredRoute = ({ component: Component, auth, ...rest }) => (
  <>
  {console.log(auth)}
  <Route {...rest} render={props => (
    auth ? (
      <Component {...props} />
    ) : (
      <Redirect from={'/'} to={'/createaccount'} />
    )
  )} />
  </>
)

const authRoutes = ({ component: Component, ...rest }) => (
  <Switch>
        <Route exact path="/test/" component={Home} />
        <Route exact path="/home/" component={Home} />
        <Redirect exact from="/" to="/home" />
  </Switch>
)


class AuthHelper extends React.Component {

  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
          this.props.updateAuthIn()
        
      } else {
        console.log("ERROR")
        this.props.updateAuthOut()
      }
    });
  }
  

  render() {
    
    return (<>
      <div className="App">
        {console.log(this.props.auth)}
            <IonApp>
            {this.props.auth}

            <IonReactRouter>
            <IonPage id="main">
            <Route path="/createaccount/" component={CreateAccount} />
            <Route path="/login/" component={LoginAccount} />
            <LoginRequiredRoute  component={authRoutes} auth={this.props.auth}/>

              
            </IonPage>
            </IonReactRouter>
            </IonApp>
          </div>
    </>
     
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth.isAuth
})

export default connect(mapStateToProps, { updateAuthIn, updateAuthOut }, null, {
  pure: false
})(AuthHelper, LoginRequiredRoute, authRoutes);
