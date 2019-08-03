import React from 'react';
import { connect } from 'react-redux'
import firebase from 'firebase'
import fire from '../fire';

import { IonAvatar, IonCard, IonTitle,IonButton } from '@ionic/react'

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import PageLayout from '../components/PageLayout'

import IosMail from 'react-ionicons/lib/IosMail'

import IosPhone from 'react-ionicons/lib/IosPhonePortrait'
import IosSettings from 'react-ionicons/lib/IosSettings'




var auth = firebase.auth();

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }; // <- set up react state
  }
  componentWillMount(){
   
  }

  render() {
    return (
      <PageLayout>
        <div className="profile">
        <IonCard mode="ios">

          <IonAvatar>
            <img src={this.props.user.photoURL ? this.props.user.photoURL.replace("profilepics/", "profilepics%2F") : ""} />
          </IonAvatar>

        <h1>{this.props.user.displayName}</h1>

        <div className="user-info">
        <IosPhone fontSize="16px" color="#FFA597" /><p>{this.props.user.phoneNumber}</p><span className="span-tag">Verified</span>
        </div>
        <div className="user-info">
        <IosMail fontSize="16px" color="#FFA597" /><p>{this.props.user.email}</p><span className="span-tag">Verified</span>
        </div>
        </IonCard>
        <IonButton mode="ios" onClick={e => {
            e.preventDefault();
            this.props.history.push('/Settings');
            }}>
            <IosSettings fontSize="24px" color="#FFA597" />
            Settings
            </IonButton>
        </div>
      </PageLayout>
  )}
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(Profile);
