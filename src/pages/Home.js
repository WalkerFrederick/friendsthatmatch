import React from 'react';
import firebase from 'firebase'
import fire from '../fire';



import { IonCard, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import AuthHelper from '../components/AuthHelper'


var auth = firebase.auth();

class LoginAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }; // <- set up react state
  }
  componentWillMount(){
   
  }

  render() {
    return (
      <div>
        hello world, this is home
        
      </div>
  )}
}

export default LoginAccount;
