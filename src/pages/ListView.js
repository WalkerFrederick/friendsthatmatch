import React from 'react';
import firebase from 'firebase'
import fire from '../fire';

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import { IonCard, IonButton } from '@ionic/react'

import PageLayout from '../components/PageLayout'

import {Plugins} from '@capacitor/core';

import { } from '../capacitor-contacts-plugin/dist/esm/index.d.ts';



var auth = firebase.auth();

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }; // <- set up react state
  }

  componentWillMount() {
    const {CappContacts} = Plugins
    Plugins.CappContacts.requestAccess().then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <PageLayout>
        <div className="listview">
          <div className="import-contacts">
            <IonCard mode="ios">
            <h1>Let's Get Started</h1>
            <p>For this app to work properly we need to import your contacts so you can start matching!</p>
            <IonButton expand="full" mode="ios">Import Contacts</IonButton> 
            </IonCard>
          </div>
        </div>
      </PageLayout>
  )}
}

export default ListView;