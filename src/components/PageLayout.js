import React from 'react';
import firebase from 'firebase'
import fire from '../fire';

import { withRouter } from 'react-router-dom'


import { IonCard, IonApp, IonPage, IonRouterOutlet, IonReactRouter, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonBadge, IonToolbar,
    IonTitle, IonButtons, IonButton, IonAvatar, IonChip,
    IonBackButton,} from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import IosSettings from 'react-ionicons/lib/IosSettings'


import AuthHelper from '../components/AuthHelper'


var auth = firebase.auth();

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }; // <- set up react state
  }

  render() {
    return (
    <div className="page-layout" style={{background: 'white'}}>
        <IonToolbar mode="ios">
        <IonButtons slot="start">
            <IonButton onClick={e => {
                e.preventDefault();
                this.props.history.push('/profile');
            }}>
                <IonAvatar>
                    <img src="https://avatars3.githubusercontent.com/u/28491173?s=460&v=4" />
                </IonAvatar>
            </IonButton>
        </IonButtons>
        <IonTitle mode="ios">FriendsThatMatch</IonTitle>
        <IonButtons slot="end">
            <IonButton onClick={e => {
            e.preventDefault();
            this.props.history.push('/Settings');
            }}>
            <IosSettings fontSize="32px" color="#FFA597" />
            </IonButton>
        </IonButtons>
        </IonToolbar>
        { this.props.children }
    </div>
  )}
}

export default withRouter(ListView);