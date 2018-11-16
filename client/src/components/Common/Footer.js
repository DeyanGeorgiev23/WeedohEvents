import React from 'react';

const Footer = () => {
  return (
              
    <footer className="page-footer font-small mdb-color pt-4  custom-footer bg-dark">
      <div className="row d-flex align-items-center">

   
        <div className="col-md-7 col-lg-8">

      
          <p className="text-center text-md-left">© 2018 Copyright:
            <a href="https://mdbootstrap.com/education/bootstrap/">
              <strong> WeedohEvents </strong>
            </a>
          </p>

        </div>
    
        <div className="col-md-5 col-lg-4 ml-lg-0">
      
          <div className="text-center text-md-right">
            
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                Sign Up with...
              </li>
              <li className="list-inline-item">
                <a href="/signup" className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fa fa-facebook"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/signup" className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/signup" className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fa fa-google-plus"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/signup" className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fa fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>

        </div>
   
      </div>
    </footer>
  );
};

export default Footer;