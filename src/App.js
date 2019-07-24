import React from 'react';
import firebase from 'firebase'
import fire from './fire';

import { IonCard, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import './App.css'

var auth = firebase.auth();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: "", email: "", password: ""}; // <- set up react state
  }
  componentWillMount(){
   
  }
  createAccount(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */

    this.setState( {
      email: this.emailInput.value,
      password: this.passwordInput.value,
    })

    auth.createUserWithEmailAndPassword(this.emailInput.value, this.passwordInput.value).catch(err => {
      console.log(err)
      return auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    }).then(res => {
        this.setState({user: res.user})
    })
    auth.onAuthStateChanged(authState => console.log(authState))
    this.emailInput.value = ''; this.passwordInput.value = '';
  }
  render() {
    return (
      <div>
        <IonGrid className="login-grid">
        <IonRow className="login-row ion-align-items-center">
            <IonCol size="12"  class="ion-text-center">
              {this.state.user.uid}
            </IonCol>
          </IonRow>
          <IonRow className="login-row ion-align-items-end">
            <IonCol size="12">
              <form onSubmit={this.createAccount.bind(this)}>
              <IonCard mode="ios"><IonInput type="text" placeholder="Email" ref={ el => this.emailInput = el }/></IonCard>
              <IonCard mode="ios"><IonInput type="password" placeholder="Password" ref={ el => this.passwordInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Create Account</IonButton>
              </form>
            </IonCol>
          </IonRow>
          <IonRow className="login-row ion-align-items-start">
            <IonCol size="12" class="ion-text-center">
              Forgot password?
              <span className="hr"></span>
              Already have an account?<br/>sign-in
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
  )}
}

export default App;
