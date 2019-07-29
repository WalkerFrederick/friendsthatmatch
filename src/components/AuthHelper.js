import React from 'react';
import { Provider, connect } from 'react-redux'
import { updateAuthIn, updateAuthOut, updateCurrentUser } from '../actions/authActions'
import store from '../store'
import { BrowserRouter as Router, Route, withRouter, Redirect, Switch } from 'react-router-dom';

import firebase from 'firebase'


import CreateAccount from '../pages/CreateAccount'
import LoginAccount from '../pages/loginAccount'

import Home from '../pages/Home'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'
import ListView from '../pages/ListView'
import SearchView from '../pages/SearchView'


import PrivateRoute from './PrivateRoute'

import { IonCard, IonApp, IonContent, IonPage, IonRouterOutlet, IonReactRouter, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonBadge, IonToolbar,
  IonTitle, IonButtons, IonButton, IonAvatar, IonChip,
  IonBackButton,} from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import {logo} from '../static/logo.png'
import IosList from 'react-ionicons/lib/IosList'
import IosSearch from 'react-ionicons/lib/IosSearch'
import IosSettings from 'react-ionicons/lib/IosSettings'






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
  <div className="application">
    <IonTabs>
      
      <IonRouterOutlet>
          <Route exact path="/list" component={ListView} />
          <Route exact path="/settings/" component={Settings} />
          <Route exact path="/profile/" component={Profile} />
          <Route exact path="/search/" component={SearchView} />
          <Route exact path="/home/" component={Home} />
          <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom">
        <IonTabButton tab="list" onClick={e => {
    e.preventDefault();
    rest.history.push('/list');
  }}>
        <IosList fontSize="100%" color="#FFA597" />
        </IonTabButton>

        <IonTabButton tab="" onClick={e => {
    e.preventDefault();
    rest.history.push('/home');
  }}>
        <svg width="auto" height="65%" viewBox="0 0 412 413" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="189.5" y="7.5" width="215" height="385" rx="32.5" stroke="#FFA597" stroke-width="15"/>
<path d="M182.031 395.318V395.318C182.031 398.432 180.29 401.349 177.35 402.378C158.611 408.936 137.476 400.683 128.386 382.45L12.2114 149.441C2.35429 129.67 10.3905 105.652 30.1609 95.7953L93 62C112.77 52.1428 144 21 162 62" stroke="#FFA597" stroke-width="15"/>
</svg>

        </IonTabButton>

        <IonTabButton tab="map" onClick={e => {
    e.preventDefault();
    rest.history.push('/search');
  }}>
          <IosSearch fontSize="65%" color="#FFA597" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </div>
    
)


class AuthHelper extends React.Component {

  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
          this.props.updateAuthIn()
          this.props.updateCurrentUser(user)
        
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

export default connect(mapStateToProps, { updateAuthIn, updateAuthOut, updateCurrentUser }, null, {
  pure: false
})(AuthHelper, LoginRequiredRoute, authRoutes);
