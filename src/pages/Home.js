import React from 'react';
import firebase from 'firebase'
import fire from '../fire';

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import PageLayout from '../components/PageLayout'

import AuthHelper from '../components/AuthHelper'



class Home extends React.Component {
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
    HOME    
    </PageLayout> 
  )}
}

export default Home;
