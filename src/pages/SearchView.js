import React from 'react';
import firebase from 'firebase'
import fire from '../fire';


import PageLayout from '../components/PageLayout'

import '@ionic/core/css/ionic.bundle.css'
import '../App.css'



var auth = firebase.auth();

class SearchView extends React.Component {
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
          
        </div>    
      </PageLayout> 
  )}
}

export default SearchView;