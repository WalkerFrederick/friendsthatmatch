import React from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

import { updateAuthIn, updateAuthOut, updateCurrentUser } from '../actions/authActions'


import fire from '../fire';
import {Redirect} from 'react-router-dom'

import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { IonCard, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonImg, IonAvatar } from '@ionic/react'
import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import logo from '../static/logo.png'

var auth = firebase.auth();
var storage = firebase.storage();


const { Camera, Filesystem, App } = Plugins;




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
     profilePicture: "",
    
    }; // <- set up react state

    defineCustomElements(window);


    App.addListener('appRestoredResult', (data: any) => {
      console.log('Restored state:', data);
      this.setState({profilePicture:data})
    });

    this.takePicture = this.takePicture.bind(this);
  }

  async takePicture() {

    console.log('Opening Camerea')
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    let imageFile = new File([], image.dataUrl)
    let imageFileType = image.format

    var encoded = image.base64String;

    var decoded = atob(encoded);
    var extension = undefined;

    var lowerCase = decoded.toLowerCase();


    if (lowerCase.indexOf("png") !== -1) extension = "png"
    else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
        extension = "jpg"
    else extension = "jpg";

    console.log(decoded);

    this.setState({profilePicture: decoded})



    console.log(image)


    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(res => {
      // Create a root reference
      var storageRef = firebase.storage().ref();

      // Create a reference to 'profile pic'
      console.log(res)
      let pofilePictureLocation = res.user.uid + '.' + extension;
      var profilePictureRef = storageRef.child('profilepics/' + res.user.uid + '.' + extension);
      profilePictureRef.putString(image.base64String, 'base64').then(snapshot => {
        console.log('Uploaded a base64url string!');
        profilePictureRef.getDownloadURL().then(async (url) => {
          console.log(url)
  
          await fetch(`https://us-central1-friendsthatmatch.cloudfunctions.net/addPhoneNumber?pn=${this.state.phoneNumber}&uid=${res.user.uid}&dn=${this.state.displayName}&ppurl=${url}`).then(res => {

            firebase.auth().currentUser.reload().then(user => {
              let currentUser = firebase.auth().currentUser
              this.props.updateCurrentUser(currentUser)
              console.log(currentUser)
            });

          })
          
    
        }).catch(err => console.log(err))
      });

    })
  
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
      displayName: this.firstNameInput.value + '' + this.lastNameInput.value, onStep: this.state.onStep + 1
    })   
  }

  addProfilePicture(e) {
    // prevent form submit from reloading the page    
    e.preventDefault();

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
          <IonRow id="login-form-row" className={`login-row ion-align-items-center ${this.state.onStep === 5 ? `` : `hidden-step`}`}>
            <IonCol size="12"> 
              <h1>Step 5</h1>
              <p>Upload your profile picture</p>
              <h2 className="login-form-error">{this.state.loginError}</h2>
              <IonAvatar><img src={this.state.profilePicture}/></IonAvatar>
              <form className="ion-text-center">
              <IonButton mode="ios" expand="full" onClick={this.takePicture}>Upload</IonButton>
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

export default connect(mapStateToProps, { updateCurrentUser })(CreateAccount);
