import React, { Component } from 'react';

import NoData from '../Common/NoData';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import Auth from '../Common/Auth';

class YourFriends extends Component {

  constructor(props) {
    super(props); 

    this.state = {
      yourFriends : this.props.yourFriendsList || []
    };

    this.yourProfile = this.yourProfile.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
  }

  componentDidMount() {
    this.yourProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.friends !== nextProps.yourFriendsList) {
      this.setState({ yourFriends : nextProps.yourFriendsList });
    }
  }
  

  async removeFriend(e) {
    let token = Auth.getToken();
    let id = e.target.parentElement.id;

    let element = e.target.parentNode;
    element.parentNode.removeChild(element);

    await this.props.removeFriend(token, id);  
  }


  async yourProfile() {
    let token = Auth.getToken();
  
    let data = await this.props.yourFriends(token);
    this.setState({ yourFriends : data.payload.friends }); 
  }


  render() {
    const { yourFriends } = this.state;
    return (
      <div>
        {yourFriends 
          ?
          yourFriends.map(data => {
            return (
              <div id={ data.id } key={ data.id } className="pt-1">
                <ul className="list-group shadow mb-1">
                  <li id={ data.id }  className="list-group-item d-flex justify-content-between align-items-center">
                    { data.username }  <small>{ data.email }</small>
                    <span onClick={ this.removeFriend } className="custom-badge badge badge-danger badge-pill waves-effect">Remove</span>
                  </li>
                </ul>
              </div>
               
            ); 
          }) 
             
          : <NoData data={"You don't have any friends yet!"}/> }
      </div>
    );
    
  }
}


function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    yourFriendsList: state.friends.yourFriendsList
  };
}

export default connect(mapStateToProps, actions)(YourFriends);


