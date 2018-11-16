import React from 'react';

import Header from './Header';
import Navigation from './Common/Navigation';
import Footer from './Common/Footer';

import '../App.css';

export default () => {
  return (
    <div>
    <div className='custom-footer'>
      <Header />
      <div className="container center-profile-page">
        <Navigation />
      </div>
      
    </div>
    <div>
    <Footer />
    </div>
    </div>
   
  );
};
