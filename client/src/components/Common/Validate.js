import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';
import * as actions from '../../actions';
import Error from '../Common/Error';

import ReactLoading from 'react-loading';
import Auth from '../Common/Auth';


class Validate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg : '',
      indicator : '',
      confirmedNewPassword : '',
      newPassword : '',
      key : '',
      loading : false
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async handleInputs(e) {
    let value = e.target.value;
    let name = e.target.name;
    await this.setState({[name] : value});
  }


  async changePassword() {
    let { key, newPassword, confirmedNewPassword } = this.state;
    let token = localStorage.getItem('secretToken');
  
    let data = await this.props.changePassword(token, key, newPassword, confirmedNewPassword);
    console.log(data);
    if(data.payload.successMessage) {
      Auth.authenticateUser(token);
      window.location.href('/');
    }
  }



  render() {
    const { msg, indicator, loading } = this.state;
    return (
      <div>    
        <div className="modal-dialog" role="document">
        
          <div className="modal-content form-elegant">
          
            <div className="modal-header text-center">
              <h3 className="modal-title w-100 dark-grey-text font-weight-bold my-3" id="myModalLabel"><strong>Change your Password</strong></h3>

            </div>
            
            <div className="modal-body mx-4">

              <div className="md-form pb-3">
                <input onChange={ this.handleInputs } name="newPassword" type="password" id="newPass" className="form-control validate"/>
                <label data-error="wrong" data-success="right" htmlFor="newPass">New Password</label>
              </div>

              <div className="md-form pb-3">
                <input onChange={ this.handleInputs } name="confirmedNewPassword" type="password" id="confirmPass" className="form-control validate"/>
                <label data-error="wrong" data-success="right" htmlFor="confirmPass">Confirm Password</label>
              </div>

              <div style={{textAlign : 'center'}} className="md-form pb-3">
                <input onChange={ this.handleInputs } name="key" type="text"  className="form-control validate"/>
                <label data-error="wrong" data-success="right" htmlFor="Form-pass3">Key</label>
              </div>
                

              {msg
                ?
                <div>
                  <Error msg={ msg } indicator={ indicator }/>
                </div>
                : null }
                
              { loading
                ?
                <div className="d-flex justify-content-center">
                  <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
                </div>
                :
                <div className="text-center mb-3">
                  <button onClick={ this.changePassword } type="button" className="btn blue-gradient btn-block btn-rounded z-depth-1a">Change your Password</button>
                </div>
              }
                               
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, actions),
)(Validate);