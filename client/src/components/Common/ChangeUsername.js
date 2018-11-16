import React, { Component } from 'react';

import Error from '../Common/Error';

import ReactLoading from 'react-loading';

export default class ChangeUsername extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      newUsername: '',
      newEmail: '',
      loading : false
    };

    this.changeData = this.changeData.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
  }

  async changeData() {
    let { newUsername, newEmail } = this.state;

    this.setState({ loading : true });
    await this.props.changeData(newUsername, newEmail);
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
        <div className="modal fade" id="changeData" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
    
            <div className="modal-content form-elegant">
      
              <div className="modal-header text-center">
                <h3 className="modal-title w-100 dark-grey-text font-weight-bold my-3" id="myModalLabel"><strong>Change your Personal Data</strong></h3>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
        
              <div className="modal-body mx-4">

                <div className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="newEmail" type="email" id="Form-pass1" className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="Form-pass1">New Email</label>
                </div>

                <div className="md-form pb-3">
                  <input onChange={ this.handleInputs } name="newUsername" type="text" id="Form-pass2" className="form-control validate"/>
                  <label data-error="wrong" data-success="right" htmlFor="Form-pass2">New Username</label>
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
                    <button onClick={ this.changeData } type="button" className="btn blue-gradient btn-block btn-rounded z-depth-1a">Change your Data</button>
                  </div>
                }
                            
              </div>
            </div>
          </div>
        </div>

        {/* onClick={ this.props.getPasswordKey } */}
        <div className="text-center">
          <button className="btn peach-gradient btn-md change-data-btn" data-toggle="modal" data-target="#changeData">Change your Data</button>
        </div>
      </div>
    );
  };
};
