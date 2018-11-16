import React, { Component } from 'react';

import Error from '../Common/Error';

import ReactLoading from 'react-loading';

export default class ChangePasswordModal extends Component {
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
    this.getPasswordKey = this.getPasswordKey.bind(this);
  }

  async handleInputs(e) {
    let value = e.target.value;
    let name = e.target.name;
    await this.setState({[name] : value});
  }

  async changePassword() {
    let { key, newPassword, confirmedNewPassword } = this.state;
    await this.props.changePassword(key, newPassword, confirmedNewPassword);
  }

  async getPasswordKey() {
    this.setState({ loading : true });
    await this.props.getPasswordKey();
    this.setState({ loading : false });
  }


  render() {
    const { msg, indicator, visability } = this.props;
    const { loading } = this.state;
    return (
      <div>    
        <div className="modal fade" id="elegantModalForm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
        
            <div className="modal-content form-elegant">
          
              <div className="modal-header text-center">
                <h3 className="modal-title w-100 dark-grey-text font-weight-bold my-3" id="myModalLabel"><strong>Change your Password</strong></h3>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            
              <div className="modal-body mx-4">

                <div className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="newPassword" type="password" id="changePass" className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="changePass">New Password</label>
                </div>

                <div className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="confirmedNewPassword" type="password" id="confirmNewPass" className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="confirmNewPass">Confirm Password</label>
                </div>

                <div style={{textAlign : 'center'}} className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="key" type="text" id="newKey"  className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="newKey">Key</label>
                  { loading
                    ?
                    <div className="d-flex justify-content-center">
                      <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
                    </div>
                    :
                    <button style={{ display : visability }} onClick={ this.getPasswordKey } className="btn btn-success btn-sm">GET SECRET KEY</button>
                  }
                </div>
                

                {msg
                  ?
                  <div>
                    <Error msg={ msg } indicator={ indicator }/>
                  </div>
                  : null }
                

                <div className="text-center mb-3">
                  <button onClick={ this.changePassword } type="button" className="btn blue-gradient btn-block btn-rounded z-depth-1a">Change your Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="btn peach-gradient btn-md change-data-btn" data-toggle="modal" data-target="#elegantModalForm">Change your Password</button>
        </div>
      </div>
    );
  }
}
