import React from 'react';

const DeleteEvent = props => {
  const { eventId, deleteEvent } = props;
  return (
    <div>
      <img data-tip="Delete this Event" style={{float : 'left', padding : '4px', cursor : 'pointer'}} data-toggle="modal" data-target="#modalConfirmDelete" src="images/rubbish-bin.png" alt="PRIVATE"/> 
      <div className="modal fade" id="modalConfirmDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-sm modal-notify modal-danger" role="document">
   
          <div className="modal-content text-center">
      
            <div className="modal-header d-flex justify-content-center">
              <p className="heading">Delete your Event</p>
            </div>

      
            <div className="modal-body">

              <i className="fa fa-times fa-4x animated rotateIn"></i>
              <br/>
              <cite>Your Event will be pernamently deleted. Are you sure you want to do this?</cite>
            </div>

      
            <div className="modal-footer flex-center" id={ eventId }>
              <button type="button" onClick={ deleteEvent } className="btn  btn-outline-danger" data-dismiss="modal">Yes</button>
              <button type="button"  className="btn  btn-danger waves-effect" data-dismiss="modal">No</button>
            </div>
          </div>
    
        </div>
      </div>

    </div>
  );
};

export default DeleteEvent;