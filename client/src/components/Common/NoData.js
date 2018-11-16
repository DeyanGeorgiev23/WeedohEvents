import React from 'react';

const NoData = props => {
  let { data } = props;
  return (
    <div style={{width : '100%', textAlign : 'center'}} className="alert alert-dark" role="alert">
      <strong>{ data }</strong>
    </div>
  );
};

export default NoData;