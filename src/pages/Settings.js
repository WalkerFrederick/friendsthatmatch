import React,{useState} from 'react';
import firebase from 'firebase'
import fire from '../fire';


import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonBadge, IonToolbar,
    IonTitle, IonButtons, IonButton, IonAvatar, IonChip,
    IonBackButton, IonAlert} from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import IosSettings from 'react-ionicons/lib/IosSettings'

import packageJSON from '../../package.json'


import PageLayout from '../components/PageLayout'


var auth = firebase.auth();


export const Settings: React.FunctionComponent = () => {

  var user = firebase.auth().currentUser;

    const [deleteAlert, setShowAlert1] = useState(false);

    return (
      <PageLayout>
        <div className="settings-page">
        <h1>Release Version {packageJSON.version}</h1>
        <IonButton mode="ios" id="sign-out-button" onClick={e => {
    e.preventDefault();
    auth.signOut();
  }} expand="full">Sign Out</IonButton>
        <IonButton mode='ios' id="delete-account-button" onClick={() => setShowAlert1(true)} expand="full">Delete Account</IonButton>
        <IonAlert mode="ios"
          isOpen={deleteAlert}
          onDidDismiss={() => setShowAlert1(false)}
          header={'Are You Sure?'}
          subHeader={`Please don't go!!!`}
          buttons={['Cancel',  {
            text: 'Ok',
            handler: () => {
              console.log(user);
              user.delete().then(function() {
                // User deleted.
              }).catch(function(error) {
                // An error happened.
              });
            }}]}
        />
        </div>
      </PageLayout>
  )
}

export default Settings;