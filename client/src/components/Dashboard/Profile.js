import React, { Component } from 'react';

import ChangePasswordModal from '../Common/ChangePasswordModal';
import DeleteAccount from '../Common/DeleteAccount';
import ChangeUsername from '../Common/ChangeUsername';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import Auth from '../Common/Auth';


class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg : '',
      indicator : '',
      visability : 'visible',
      username: this.props.personalData.username,
      email: this.props.personalData.email
    };

    this.getPasswordKey = this.getPasswordKey.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.changeData = this.changeData.bind(this);
  } 

  componentWillReceiveProps(nextProps) {
    if (this.state.username !== nextProps.personalData.username) {
      this.setState({ username: nextProps.personalData.username });
    }
  }

  async getPasswordKey() {
    let token = Auth.getToken();

    const data = await this.props.getPasswordKey(token);
    
    if(data.payload.errorMessage) {
      this.setState({ msg : data.payload.errorMessage, indicator : 'alert alert-danger', visability : 'none'});
    } else if(data.payload.successMessage) {
      this.setState({ msg : data.payload.successMessage, indicator : 'alert alert-success', visability : 'none'});
    }
  }

  async changeData(username, email) {
    let token = Auth.getToken();
        
    const data = await this.props.changeData(token, username, email);

    if (data) {
      this.setState({ msg: 'Successfully changed!', indicator: 'alert alert-success' });
    } else {
      this.setState({ msg: 'Something went wrong!', indicator: 'alert alert-danger' });
    }

    let timer = setTimeout(() => {
      this.setState({ msg: null, indicator: null });
      clearTimeout(timer);
    }, 3000);
  }


  async changePassword(key, newPassword, confirmedNewPassword) {
    let token = Auth.getToken();
    
    let data = await this.props.changePassword(token, key, newPassword, confirmedNewPassword);
    
    if(data.payload.successMessage) {
      Auth.deauthenticateUser();
      window.location.reload();
    }
  }

  async deleteAccount() {
    let token = Auth.getToken();

    let data = await this.props.deleteAccount(token);

    if(data.payload.successMessage) {
      Auth.deauthenticateUser();
      window.location.reload();
    }
  }

  
  render() {
    let { msg, indicator, visability } = this.state;
    let { username, email } = this.props.personalData;
    return (
      <div className="row mt-3">
        <div className="card ">
          <div className="card-header"><strong>{ username }</strong> <cite>{ email }</cite></div>
          <div className="card-body">
            <ChangeUsername 
              changeData={ this.changeData }
              msg={ msg }
              indicator={ indicator }
            />
            <ChangePasswordModal 
              getPasswordKey={ this.getPasswordKey } 
              changePassword={ this.changePassword }
              msg={ msg }
              indicator={ indicator }
              visability={ visability }
            />
            <DeleteAccount deleteAccount={ this.deleteAccount } />
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    personalData: state.friends.personalData
  };
}

export default connect(mapStateToProps, actions)(Profile);
