import React from 'react';
import firebase from 'firebase'
import fire from '../fire';

import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'



import { parsePhoneNumberFromString } from 'libphonenumber-js'


import { IonCard, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import logo from '../static/logo.png'

var auth = firebase.auth();

class LoginAccount extends React.Component {
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
    
    }; // <- set up react state
  }
  componentWillMount(){
   
  }
  LoginAccount(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */

    this.setState( {
      email: this.emailInput.value,
      password: this.passwordInput.value,
    })

 
       
        auth.createUserWithEmailAndPassword(this.emailInput.value, this.passwordInput.value).catch(err => {
          this.setState({loginError: err.message})

          return err
        }).then(res => {
            this.setState({uid: res.user.uid})
            return res.user
        }).then(res => {
          if (res.phoneNumber !== null) {
            console.log("logged in")
          }
          else {
            this.setState({onStep: this.state.onStep + 1})
          }
      }).catch(err => {
        auth.signInWithEmailAndPassword(this.state.email,  this.state.password).then(res => {

      if (res.user.phoneNumber === null) {
        this.setState({uid: res.user.uid})
        this.setState({onStep: this.state.onStep + 1})
      }
      else {
        this.setState({onStep: this.state.onStep + 3 , userLoginState: "USER IS LOGGED IN AND VERIFIED"})
      }

      }).catch(err => this.setState({loginError: err.message}))
      })

    auth.onAuthStateChanged(authState => console.log(authState))
    this.emailInput.value = ''; this.passwordInput.value = '';
  }

  addPhoneNumber(e){
    e.preventDefault(); // <- prevent form submit from reloading the page

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
    })
    

    this.phoneNumberInput.value = '';
  }
  }

  verifyPhone(e) {
    e.preventDefault();

    this.setState({
      verificationCode: this.verificationCodeInput.value
    })

    fetch(`https://us-central1-friendsthatmatch.cloudfunctions.net/checkVerificationCode?pn=${this.state.phoneNumber}&vc=${this.verificationCodeInput.value}&uid=${this.state.uid}`).then(res => {
      if (res.status === 200) {
        this.setState({onStep: this.state.onStep + 1, userLoginState: "USER IS LOGGED IN AND VERIFIED"})
        return 1;
      }
      else {
        this.setState({userLoginState: "USER AUTH FAILED", loginError: "code not valid"})
      }
      
    }).catch(err => this.setState({userLoginState: "USER AUTH FAILED", loginError: "code not valid"}))
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
              <h1>Login</h1>
              <p>Login to your account</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.LoginAccount.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="Email" ref={ el => this.emailInput = el }/></IonCard>
              <IonCard mode="ios"><IonInput className="ion-text-left" type="password" placeholder="Password" ref={ el => this.passwordInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Login</IonButton>
              <IonButton mode="ios" class="button-reverse" expand="full" onClick={e => {
                    e.preventDefault();
                    this.props.history.push('/createaccount');
                }}>Go Back</IonButton>
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
              <p>Verify Phone Number</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <form onSubmit={this.verifyPhone.bind(this)} className="ion-text-center">
              <IonCard mode="ios"><IonInput className="ion-text-left" type="text" placeholder="Verification Code" ref={ el => this.verificationCodeInput = el }/></IonCard>
              <IonButton mode="ios" expand="full" type="submit">Verify</IonButton>
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

export default connect(mapStateToProps)(LoginAccount);
