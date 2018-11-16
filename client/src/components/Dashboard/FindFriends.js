import React, { Component } from 'react';

import Auth from '../Common/Auth';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import FriendsList from './FriendsList';

import ReactLoading from 'react-loading';

import NoData from '../Common/NoData';

import ScrollUpButton from "react-scroll-up-button";


class FindFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue : '',
      friendList: [],
      friendReq: [],
      limit : 10,
      loading : false,
      errorMessage: '',
      showMore: true
    };

    this.getInputValue = this.getInputValue.bind(this);
    this.inviteFriends = this.inviteFriends.bind(this);
    this.showMoreFriends = this.showMoreFriends.bind(this);
    this.serverSearch = this.serverSearch.bind(this);
    this.clearTheInput = this.clearTheInput.bind(this);
  }

  componentDidMount() {
    this.handleFriends();
  }

  async componentWillReceiveProps(nextProps) {
    if (this.state.friendList !== nextProps.allUsersList && nextProps.allUsersList !== undefined) {
      await this.setState({ friendList: nextProps.allUsersList });
    }
  }

  async getFriends() {
    let { limit } = this.state;
    let token = Auth.getToken();
    const data = await this.props.findFriends(token, limit);

    if (this.state.friendReq !== data.payload.yourSendedReq) {
      this.setState({friendList : data.payload.users, 
        friendReq : data.payload.yourSendedReq, 
        loading : false
      });
    }
  }
  

  getInputValue(e) {
    let text = e.target.value;
    if(text.length >= 3) {
      this.setState({inputValue : text});
    }
    
  }

  async handleFriends() {
    let { limit } = this.state;
    let token = Auth.getToken();

    const data = await this.props.findFriends(token, limit);

    if (data.payload.errorMessage) {
      this.setState({ errorMessage: data.payload.errorMessage });
    }

    if (data.payload.warningMessage === true) {
      await this.setState({ showMore: false });
      console.log(this.state.showMore);
    }

    this.setState({friendList : data.payload.users, 
      friendReq : data.payload.yourSendedReq, 
      loading : false
    });
    
  }

  async inviteFriends(e) {
    let id = e.target.parentNode.parentNode.id;
    e.target.innerHTML = 'Request sended!';
    e.target.classList.add("badge-success");
    let token = Auth.getToken();

    let data = await this.props.inviteFriend(token, id);

    if (data) {
      this.getFriends();
    }
    
  }

  async showMoreFriends() {
    let { limit } = this.state;
    await this.setState({limit : limit + 10, loading : true});
    await this.handleFriends();

  }

  async serverSearch() {
    let token = Auth.getToken();
    let text = this.state.inputValue;
    let data = await this.props.serverSearch(token, text);

    if(text.length >= 3) {
      this.setState({ friendList : data.payload.users});
    } 
  }

  clearTheInput() {
    let input = document.getElementById('search-input');
    input.value = '';
    this.setState({ inputValue : ''});
    this.handleFriends();
  }

   
  render() {
    const { friendList, friendReq, inputValue , loading} = this.state;
    return (
      <div className="container mt-3">
        <div className="input-group mb-3">
          <input onChange={ this.getInputValue } type="text" className="form-control" placeholder="Search" aria-label="Search..." aria-describedby="basic-addon2" id="search-input"/>
          {inputValue ? <button className="clear-button" onClick={ this.clearTheInput }>X</button> : null}
          
          <button className="friends-search-button" onClick={ this.serverSearch }>
            <img src="images/search.png" alt="Search"/>
          </button>
        </div>
        <FriendsList 
          friendList={ friendList }
          friendReq={ friendReq }
          getInputValue={ this.getInputValue }
          inputValue={ inputValue }
          inviteFriends={ this.inviteFriends } />

        { loading 
          ?
          <div className="d-flex justify-content-center">
            <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
          </div>
          :
          <div>
            <NoData data={ this.state.errorMessage }/>
          </div>
        }
        {this.state.showMore 
        ?
        <button onClick={ this.showMoreFriends }>View more</button>
        : null }
        <ScrollUpButton />
      </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    allUsersList: state.friends.allUsersList
  };
}

export default connect(mapStateToProps, actions)(FindFriends);


