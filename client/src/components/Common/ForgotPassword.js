import React, { Component } from 'react';

import Error from '../Common/Error';

import ReactLoading from 'react-loading';

export default class ForgotPassword extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      newEmail: '',
      loading : false
    };

    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
  }

  async forgotPassword() {
    let { newEmail } = this.state;

    this.setState({ loading : true });
    await this.props.forgotPassword(newEmail);
    this.setState({ loading : false });
  }

  async handleInputs(e) {
    let value = e.target.value;
    let name = e.target.name;
    await this.setState({[name] : value});
  }

  render() {
    const { msg, indicator } = this.props;
    const { loading } = this.state;
    return (
      <div>    
        <div className="modal fade" id="forgotPassword" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
    
            <div className="modal-content form-elegant">
      
              <div className="modal-header text-center">
                <h3 className="modal-title w-100 dark-grey-text font-weight-bold my-3" id="myModalLabel"><strong>Forgot Password</strong></h3>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
        
              <div className="modal-body mx-4">

                <div className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="newEmail" type="email" id="NewEmail" className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="NewEmail">Your Email</label>
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
                    <button onClick={ this.forgotPassword } type="button" className="btn blue-gradient btn-block btn-rounded z-depth-1a">Send Email</button>
                  </div>
                                    
                }
                            
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button type='button' className="forgot-password-btn" data-toggle="modal" data-target="#forgotPassword">Forgot Password?</button>
        </div>
      </div>
    );
  };
};
