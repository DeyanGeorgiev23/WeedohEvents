import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'mdbreact';

import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import ReactLoading from 'react-loading';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import Auth from '../Common/Auth';

class ModalCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal15: false,
      date: new Date(),
      range: this.props.event.numberOfParticipants,
      title: this.props.event.title,
      description: this.props.event.description,
      hour: Number(this.props.event.hour.split(':')[0]),
      min: Number(this.props.event.hour.split(':')[1]),
      eventCondition : this.props.event.isPrivate ? 'Private' : 'Public',
      loading : false,
      isPrivate: this.props.event.isPrivate
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.isPrivate = this.isPrivate.bind(this);
    this.dateSplitter = this.dateSplitter.bind(this);
    this.editEvent = this.editEvent.bind(this);
  }

  onChange = date => this.setState({ date });

    dateSplitter(date) {
      date = JSON.stringify(date)
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

  toggle(nr) {
    let modalNumber = 'modal' + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }

  handleInputs(e) {
    this.setState({[e.target.name] : e.target.value});
  }


  isPrivate() {
    let condition = !this.state.isPrivate ? 'Private' : 'Public';
    this.setState({ isPrivate : !this.state.isPrivate, eventCondition : condition});
  }

  async editEvent() {
    let token = Auth.getToken();
    let data = { 
      eventId: this.props.event.eventId,
      title: this.state.title,
      description: this.state.description,
      date: this.dateSplitter(this.state.date).date,
      hour: Number(this.state.hour) +  ':' + Number(this.state.min),
      isPrivate: this.state.isPrivate,
      numberOfParticipants: this.state.range
    };
    
    this.setState({ loading : true });
    await this.props.editEvent(token, data);
    this.setState({ modal15 : false, loading : false });
  }



  render() {
    let { date, range, eventCondition, loading } = this.state;
    return (
      <div style={{marginLeft: '1.5rem'}}>
        <button className="btn btn-warning rouded-button" onClick={() => this.toggle(15)}>Edit your Event</button>
        <Modal isOpen={this.state.modal15} toggle={() => this.toggle(15)}>
          <ModalHeader toggle={() => this.toggle(15)}>Edit Event</ModalHeader>
          <ModalBody>
            <div className="row">

              <div className="col-lg-6 mb-2">
                <Calendar onChange={ this.onChange }/>
              </div>

              <div className="col-lg-6 fixed-height">
 
                <div className="card shadow-lg mb-2">
                  <div className="card-body">
                    <h6 className="text-sm-center">
                      {this.props.event.date || this.dateSplitter(date).date }
                    </h6>
                  </div>
                </div>

                <div className="card shadow-lg mb-2">
                  <div className="card-body">
                    <div className="text-sm-center form-group">
                      <div className="md-form">
                        <input name="title" onChange={ this.handleInputs } type="text" id="form1" class="form-control" placeholder={ this.props.event.title }/>
                        <label for="form1">Title</label>
                      </div>
                    </div>

                    <div class="md-form">
                      <textarea onChange={ this.handleInputs } name="description"  type="text" id="form10" class="md-textarea form-control" rows="2" placeholder={ this.props.event.description }></textarea>
                      <label for="form10">Description</label>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{marginLeft: '1.3rem'}}  className='col-lg-11 card shadow-lg center'>
                <div>
                  <cite>Your event is now { eventCondition }</cite>
                </div>

                <div>
                  <label class="bs-switch">
                    <input onChange={ this.isPrivate } checked={ this.state.isPrivate } type="checkbox"/>
                    <span class="slider round"></span>
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

                <div style={{display: 'inline'}}>
                  <p>Change the event hour</p>
                  <input  style={{width: '20%'}} onChange={ this.handleInputs }  placeholder={ this.props.event.hour.split(':')[0] } type="number" name="hour" />:
                  <input style={{width: '20%'}} onChange={ this.handleInputs } placeholder={ this.props.event.hour.split(':')[1] } type="number" name="min" />
                </div>
               
                { loading 
                  ?
                  <div className="d-flex justify-content-center">
                    <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
                  </div>
                  :
                  <Button onClick={ this.editEvent } className="m-3" color="primary">Save changes</Button>}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default connect(mapStateToProps, actions)(ModalCenter);
