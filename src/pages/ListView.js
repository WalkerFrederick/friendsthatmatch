import React from 'react';
import firebase from 'firebase'
import fire from '../fire';

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'

import PageLayout from '../components/PageLayout'

var auth = firebase.auth();

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }; // <- set up react state
  }

  render() {
    return (
      <PageLayout>
        hello world
      </PageLayout>
  )}
}

export default ListView;