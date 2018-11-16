import React from 'react';

const Error = props => {
  let { msg, indicator } = props;

  // if(msg) {
  //     const errorPanel = document.getElementById('error-panel')
  //     setTimeout(() => {
            
  //     }, 2000)
  // }

  return (
    <div id="center error-panel" className={indicator} role="alert">
      { msg }
    </div>
  );
};

export default Error;