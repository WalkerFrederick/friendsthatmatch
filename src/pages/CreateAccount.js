import React from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'

import fire from '../fire';
import {Redirect} from 'react-router-dom'

import { parsePhoneNumberFromString } from 'libphonenumber-js'


import { IonCard, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import logo from '../static/logo.png'

var auth = firebase.auth();

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     uid: "",
     email: "", 
     password: "", 
     phoneNumber: "",
     verificationCode: "",
     onStep: 1,
     userLoginState: "logged Out",
     loginError: "",
     displayName: "",
     lastName: "",
    
    }; // <- set up react state
  }


  // CREATE ACCOUNT HANDLER - STORE EMAIL AND PASSWORD IN STATE
  createAccount(e){
    // prevent form submit from reloading the page    
    e.preventDefault();

    // STORE INPUT IN STATE
    this.setState( {
      email: this.emailInput.value,
      password: this.passwordInput.value,
    })

    // TRY TO SIGN IN WITH EMAIL AND PASSWORD, CATCH IF THEY ARE NEW!
    auth.signInWithEmailAndPassword(this.emailInput.value, this.passwordInput.value).then(res => { 
      // CONFIRM THAT USER HAS A PHONE NUMBER ASSOCIATED WITH ACCOUNT
        if (res.phoneNumber === null) {
          throw "USER's PHONE NUMBER IS NOT VERIFIED"
        }
      }).catch(err => {
      // NOT EXISTING USER, GO TO PHONE VERIFICATION
        this.setState({onStep: this.state.onStep + 1
      })
    })

    this.emailInput.value = ''; this.passwordInput.value = '';
  }

  addPhoneNumber(e){
    // prevent form submit from reloading the page    
    e.preventDefault();

    if (toString(this.phoneNumberInput.value).length < 10) {
      this.setState({loginError: "Minimum of 10 digits"})
      throw "MIN 10 DIGITS"
    } else {
    this.setState({onStep: this.state.onStep + 1})
    let parsedPhoneNum = parsePhoneNumberFromString( this.phoneNumberInput.value, 'US').number
    this.setState({
      phoneNumber: parsedPhoneNum
    })
    fetch(`https://us-central1-friendsthatmatch.cloudfunctions.net/sendVerificationCode?pn=${parsedPhoneNum}`).then(res => {
      console.log(this.state.phoneNumber)
    })
    
    this.phoneNumberInput.value = '';
  }
  }

  verifyPhone(e) {
    // prevent form submit from reloading the page    
    e.preventDefault();

    this.setState({
      verificationCode: this.verificationCodeInput.value
    })

    fetch(`https://us-central1-friendsthatmatch.cloudfunctions.net/checkVerificationCode?pn=${this.state.phoneNumber}&vc=${this.verificationCodeInput.value}`).then(res => {
      if (res.status === 200) {
        this.setState({onStep: this.state.onStep + 1})
        return 1;
      }
      else {
        this.setState({userLoginState: "USER AUTH FAILED", loginError: "code not valid"})
      }
      
    }).catch(err => this.setState({userLoginState: "USER AUTH FAILED", loginError: "code not valid"}))
  }

  updateProfile(e) {
    // prevent form submit from reloading the page    
    e.preventDefault();

    this.setState({
      displayName: this.firstNameInput.value,
    })

      
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(res => {
      console.log(this.state.phoneNumber)
      fetch(`https://us-central1-friendsthatmatch.cloudfunctions.net/addPhoneNumber?pn=${this.state.phoneNumber}&uid=${res.user.uid}&dn=${this.firstNameInput.value}`)
    })

      
    
  }

  render() {
    if (this.props.auth === true) {
      return  <Redirect to='/' />
    }
    return (
      <div>
        <IonGrid className="login-grid">
        <IonRow className="login-row ion-align-items-center ion-justify-content-center">
            <IonCol size="12"  class="ion-text-center img-col">
              <IonImg src={logo}></IonImg>
            </IonCol>
          </IonRow>
          <IonRow id="login-form-row" className={`login-row ion-align-items-center ${this.state.onStep === 1 ? `` : `hidden-step`}`}>
            <IonCol size="12"> 
              <h1>Step 1</h1>
              <p>Create your account</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.createAccount.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="Email" ref={ el => this.emailInput = el }/></IonCard>
              <IonCard mode="ios"><IonInput className="ion-text-left" type="password" placeholder="Password" ref={ el => this.passwordInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Create Account</IonButton>
              <IonButton mode="ios" class="button-reverse" expand="full" onClick={e => {
    e.preventDefault();
    this.props.history.push('/login');
  }}>
                Sign In
            </IonButton>

              </form>
            </IonCol>
          </IonRow>
          <IonRow id="login-form-row" className={`login-row ion-align-items-center ${this.state.onStep === 2 ? `` : `hidden-step`}`}>
            <IonCol size="12"> 
              <h1>Step 2</h1>
              <p>Add your phone number</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.addPhoneNumber.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" inputMode="tel" required="true" type="tel" pattern=".{10,}" placeholder="Phone Number" ref={ el => this.phoneNumberInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Send Verification Text</IonButton>

              </form>
            </IonCol>
          </IonRow>
          <IonRow id="login-form-row" className={`login-row ion-align-items-center ${this.state.onStep === 3 ? `` : `hidden-step`}`}>
            <IonCol size="12"> 
              <h1>Step 3</h1>
              <p>Verify phone number</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.verifyPhone.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="Verification Code" ref={ el => this.verificationCodeInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Verify</IonButton>
              </form>
            </IonCol>
          </IonRow>
          <IonRow id="login-form-row" className={`login-row ion-align-items-center ${this.state.onStep === 4 ? `` : `hidden-step`}`}>
            <IonCol size="12"> 
              <h1>Step 4</h1>
              <p>Tell us about yourself</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.updateProfile.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="First Name" ref={ el => this.firstNameInput = el }/></IonCard>
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="Last Name" ref={ el => this.lastNameInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Add To Profile</IonButton>
              </form>
            </IonCol>
          </IonRow>
          <IonRow id="login-row-bottom" className="login-row ion-align-items-center">
            <IonCol size="12" class="ion-text-center">

            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
  )}
}

const mapStateToProps = state => ({
  auth: state.auth.isAuth
})

export default connect(mapStateToProps)(CreateAccount);
