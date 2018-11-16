import React, { Component } from 'react';

import Auth from '../Common/Auth';

import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import TimeInput from 'material-ui-time-picker';
import ReactLoading from 'react-loading';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import InviteParticipants from '../Common/InviteParticipants';


class MakeEvent extends Component {

   constructor(props) {
      super(props);
        
      this.state = {
         date: new Date(),
         range: 1,
         ids: [],
         title: '',
         description: '',
         yourFriends : [],
         time : '',
         clock : '',
         eventCondition : 'Public',
         loading : false,
         allUsersList: []
      };

      this.getPickerValue = this.getPickerValue.bind(this);
      this.dateSplitter = this.dateSplitter.bind(this);
      this.handleInputs = this.handleInputs.bind(this);
      this.getFriendId = this.getFriendId.bind(this);
      this.isPrivate = this.isPrivate.bind(this);
      this.createEvent = this.createEvent.bind(this);
      this.onTimeChange = this.onTimeChange.bind(this);
      
   }

   componentDidMount() {
       this.yourProfile();
       this.setState({ allUsersList: this.props.allUsersList })
   }

   componentWillReceiveProps(nextProps) {
       if (this.state.yourFriends !== nextProps.yourFriendsList) {
           this.setState({ yourFriends: nextProps.yourFriendsList });
       }

   }
   

   onChange = date => this.setState({ date });

   onTimeChange(time) {
        let hour = Number(this.dateSplitter(time).time.split(':')[0]) + 2;
        let min = this.dateSplitter(time).time.split(":")[1];
        let clock = `${hour}:${min}`

        this.setState({ clock : clock })
   }    

   getPickerValue = (value) => {
    console.log(value);
  }


   dateSplitter(date) {
        date = JSON.stringify(date);
        let splittedDate = date.split('T');
        let newDate = splittedDate[0].substr(1);
        let newTime = splittedDate[1].slice(0, -1).split(".")[0];
        let updatedDate = newDate.split('-')
        let updatedDate2 = `${updatedDate[0]}-${updatedDate[1]}-${+updatedDate[2] }`
        let timeStamp = {
            date : updatedDate2,
            time : newTime
        };
            
        return timeStamp;
    }

    handleInputs(e) {
        this.setState({[e.target.name] : e.target.value})
        this.checkData()
    }
    
    getFriendId(e) {
        let id = e.target.parentNode.id;
        this.setState({ ids: [...this.state.ids, id] });

        let element = e.target.parentNode;
        element.parentNode.removeChild(element);
    }

    isPrivate() {
        let condition = !this.state.isPrivate ? 'Private' : 'Public';
        this.setState({ isPrivate : !this.state.isPrivate, eventCondition : condition})
    }

    

    async createEvent() {
        let token = Auth.getToken();
        let data = { 
            title: this.state.title,
            description: this.state.description,
            date: this.dateSplitter(this.state.date).date,
            hour: this.state.clock,
            isPrivate: this.state.isPrivate,
            numberOfParticipants: this.state.range,
            participants: this.state.ids
        }
        
        this.setState({ loading : true })
        await this.props.createdEvent(token, data);
        this.setState({ loading : false })
    }

    async yourProfile() {
        let token = Auth.getToken();
    
        let data = await this.props.yourFriends(token);
          
        this.setState({ yourFriends : data.payload.friends }); 
    }

    checkData() {
        if (this.state.allUsersList !== this.props.allUsersList) {
            this.yourProfile();
        }
    };


   render() {
      const { date, range, eventCondition, loading, yourFriends } = this.state;
      return (
         <div className="events-wrapper mt-3">

            <div className="row">

              <div className="col-lg-4">
                <Calendar onChange={ this.onChange }/>
              </div>

              <div className="col-lg-4 fixed-height">
               
                    <div className="card shadow-lg mb-3">
                        <div className="card-body">
                            <h3 className="text-sm-center">
                                {this.dateSplitter(date).date }
                            </h3>
                        </div>
                    </div>

                    <div className="card shadow-lg mb-3">
                        <div className="card-body">
                          <div className="text-sm-center form-group">
                            <div className="md-form">
                                <input name="title" onChange={ this.handleInputs } type="text" id="form1" className="form-control"/>
                                <label htmlFor="form1">Title</label>
                            </div>
                           </div>

                            <div className="md-form">
                                <textarea onChange={ this.handleInputs } name="description"  type="text" id="form10" className="md-textarea form-control" rows="1.9"></textarea>
                                <label htmlFor="form10">Description</label>
                            </div>
                        </div>
                    </div>
              </div>

              <div className='col-lg-4 card shadow-lg center fixed-height'>
                    <div>
                        <cite>Your event is now { eventCondition }</cite>
                    </div>

                    <div>
                        <label className="bs-switch">
                        <input onChange={ this.isPrivate } type="checkbox"/>
                        <span className="slider round"></span>
                        </label>
                    </div>
                   

                    <div className="p-2">
                        <p>{ range } person</p>
                        <input
                            type="range"
                            onChange={ this.handleInputs }
                            name="range"
                            min="1"                  
                            max="15"                  
                            step="1"
                            value={ range }                  
                            data-orientation="vertical" />
                    </div>

                    <TimeInput
                    mode='24h'
                    onChange={(time) => this.onTimeChange(time)}
                    />
                    <div className="pt-5">
                    <InviteParticipants 
                        yourFriends={ yourFriends }
                        getFriendId={ this.getFriendId } />
                    </div>    
              </div>

            </div>

            { loading 
          ?
          <div className="d-flex justify-content-center">
            <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
          </div>
          :
            <div className="center">
                <button onClick={this.createEvent} type="button" className="btn btn-outline-success waves-effect mt-4 mb-4">Create your event</button>
            </div> }
            
         </div>
      );
   }
}


function mapStateToProps(state) {
    return {
        errorMessage: state.auth.errorMessage,
        yourFriendsList: state.friends.yourFriendsList,
        allUsersList: state.friends.allUsersList
    };
  }
  
  export default connect(mapStateToProps, actions)(MakeEvent);
  
