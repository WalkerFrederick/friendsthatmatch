import React from 'react';
import firebase from 'firebase'
import fire from '../fire';
import {connect} from 'react-redux'
import { updateContactsAccess } from '../actions/permissionActions'

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import { IonCard, IonButton } from '@ionic/react'

import PageLayout from '../components/PageLayout'
import GetStarted from '../components/GetStarted'

import {Plugins} from '@capacitor/core';

import { } from 'capacitor-contacts-plugin';



var auth = firebase.auth();

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }; // <- set up react state
  }

  componentWillReceiveProps() {

  }

    componentWillMount() {
      console.log(this.props.contactPermission)
      const {CappContacts} = Plugins
      Plugins.CappContacts.authorizationStatus().then(async res => {
        if (res.status !== this.props.contactPermission) {
          this.props.updateContactsAccess(res.status)
        } else {
          this.props.updateContactsAccess(false)
        }

      })
      .catch(err => {
        console.log(err)
      })
    }
  


  render() {
    return (
      <PageLayout>
        <div className="listview">
          {this.props.contactPermission ? <h1>WORKING</h1> : <GetStarted/>}
          
        </div>
      </PageLayout>
  )}
}

const mapStateToProps = state => ({
  contactPermission: state.permissions.authorizationStatus
})

export default connect(mapStateToProps, { updateContactsAccess })(ListView);