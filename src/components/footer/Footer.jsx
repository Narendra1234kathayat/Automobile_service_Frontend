import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row">

          {/* About Section */}
          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">AutoCare</h5>
            <p>
              Your one-stop solution for vehicle servicing and spare part availability. Track, manage, and connect with nearby service centers and hardware shops.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Quick Links</h5>
            <p><Link to={'/'} className="text-light text-decoration-none">Home</Link></p>
            <p><Link to={'/cartpage'} className="text-light text-decoration-none">Cart</Link></p>
            <p><Link to={'/profile'} className="text-light text-decoration-none">Profle page</Link></p>
            <p><Link to={'/order-history'} className="text-light text-decoration-none">Order History</Link></p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Contact</h5>
            <p><i className="bi bi-geo-alt-fill me-2"></i> Vadodara, Gujarat, India</p>
            <p><i className="bi bi-envelope-fill me-2"></i> support@autocare.com</p>
            <p><i className="bi bi-phone-fill me-2"></i> +91 9876543210</p>
          </div>

          {/* Social Media */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Follow Us</h5>
            <a href="#" className="text-light me-3"><i className="bi bi-facebook fs-4"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-instagram fs-4"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-twitter fs-4"></i></a>
            <a href="#" className="text-light"><i className="bi bi-linkedin fs-4"></i></a>
          </div>

        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-md-12 text-center">
            <p>&copy; 2025 AutoCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
