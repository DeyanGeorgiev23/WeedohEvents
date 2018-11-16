import React, { Component } from 'react';

import Auth from './Common/Auth';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username : ''
    };

    this.signOut = this.signOut.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  componentDidMount() {
    this.getProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.username !== nextProps.personalData.username) {
      this.setState({ username: nextProps.personalData.username });
    }
  }


  signOut() {
    this.props.signOut();
  }

  async getProfile() {
    let token = Auth.getToken();
    let data = await this.props.getProfile(token);

    this.setState({
      username: data.payload.user.username,
      email: data.payload.user.email,
    });
  }
   

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom : '30px'}}>
        <Link to="/" className="navbar-brand">Biggest Alley Oop</Link>

        <div className="navbar-collapse collapse">
               
          <ul className="navbar-nav mr-auto">
            {this.props.isAuth 
              ?
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-light">
                  {this.state.username ? <span><img src="images/users2.png" alt="USER"/>{ this.state.username }</span> : ''}
                </Link>
              </li>
              : null }   
          </ul>
                 

          { !this.props.isAuth ?
            <ul className="nav navbar-nav ml">
              <li className="nav-item">
                <Link to="signup" className="nav-link">
                                Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="signin" className="nav-link">
                                Sign In
                </Link>
              </li>
            </ul>
            :
            null }

          { this.props.isAuth ? 
            <ul className="nav navbar-nav ml">
              <li onClick={this.signOut} className="nav-item">
                <Link to="signout" className="nav-link">
                  <img className="img-exit" src="images/exit.png" alt="EXIT" />
                </Link>
                        
              </li>
            </ul>
            : null } 
              

        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuth: state.auth.isAuthenticated,
    personalData: state.friends.personalData
  };
}
 
export default connect(mapStateToProps, actions)(Header);
 
