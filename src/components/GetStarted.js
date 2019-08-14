import React from 'react';
import {connect} from 'react-redux'
import { updateContactsAccess } from '../actions/permissionActions'


import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import { IonCard, IonButton } from '@ionic/react'

import PageLayout from '../components/PageLayout'

import {Plugins} from '@capacitor/core';
import { } from 'capacitor-contacts-plugin';

class GetStarted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }; // <- set up react state
  }

  componentWillMount() {
    
  }
  

  handleGetStarted() {
    const {CappContacts} = Plugins
    Plugins.CappContacts.authorizationStatus().then(async res => {
      console.log(res)
      if (res.status == true) {
        this.props.updateContactsAccess(true)
          Plugins.CappContacts.getAllContacts().then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      }
      else {
         await Plugins.CappContacts.requestAccess().then(res => {
          Plugins.CappContacts.authorizationStatus().then(async res => {
            console.log("LOOKING HERE:" + res.status)
            this.props.updateContactsAccess(res.status)
            if (res.status == true) {
              Plugins.CappContacts.getAllContacts().then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
          }
          }).catch(err => {
            console.log(err)
          })
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
        <div className="GetStarted">
          <div className="import-contacts">
            <IonCard mode="ios">
            <h1>Let's Get Started</h1>
            <p>For this app to work properly we need to import your contacts so you can start matching!</p>
            <IonButton onClick={() => this.handleGetStarted()} expand="full" mode="ios">Import Contacts</IonButton> 
            </IonCard>
          </div>
        </div>
  )}
}

const mapStateToProps = state => ({
    contactPermission: state.permissions.authorizationStatus
  })

export default connect(mapStateToProps, { updateContactsAccess }, null, {
    pure: false
  })(GetStarted);