import React from 'react';

const DeleteAccount = props => {
  const { deleteAccount } = props;
  return (
    <div>
      <button type="button" className="btn peach-gradient btn-md change-data-btn" data-toggle="modal" data-target="#modalConfirmDelet">Delete your Account</button>
      <div className="modal fade" id="modalConfirmDelet" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-sm modal-notify modal-danger" role="document">
   
          <div className="modal-content text-center">
      
            <div className="modal-header d-flex justify-content-center">
              <p className="heading">Delete your Account</p>
            </div>

      
            <div className="modal-body">

              <i className="fa fa-times fa-4x animated rotateIn"></i>
              <br/>
              <cite>Your Account will be pernamently deleted. Are you sure you want to do this?</cite>
            </div>

      
            <div className="modal-footer flex-center">
              <button type="button" onClick={ deleteAccount } className="btn  btn-outline-danger" data-dismiss="modal">Yes</button>
              <button type="button" className="btn  btn-danger waves-effect" data-dismiss="modal">No</button>
            </div>
          </div>
    
        </div>
      </div>

    </div>
  );
};

export default DeleteAccount;