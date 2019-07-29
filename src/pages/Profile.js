import React from 'react';
import { connect } from 'react-redux'
import firebase from 'firebase'
import fire from '../fire';

import { IonAvatar, IonCard, IonTitle } from '@ionic/react'

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import PageLayout from '../components/PageLayout'

import IosMail from 'react-ionicons/lib/IosMail'

import IosPhone from 'react-ionicons/lib/IosPhonePortrait'



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
        <h1>Your Profile</h1>

          <IonAvatar>
            <img src="https://avatars3.githubusercontent.com/u/28491173?s=460&v=4" />
          </IonAvatar>

        <div className="user-info">
        <IosPhone fontSize="16px" color="#FFA597" /><p>{this.props.user.phoneNumber}</p><span className="span-tag">Verified</span>
        </div>
        <div className="user-info">
        <IosMail fontSize="16px" color="#FFA597" /><p>{this.props.user.email}</p><span className="span-tag">Verified</span>
        </div>
        </IonCard>
        </div>
      </PageLayout>
  )}
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(Profile);
