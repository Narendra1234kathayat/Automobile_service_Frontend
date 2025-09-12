import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Simple animation variants
  const fadeInUp = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      className="pt-lg-5 pt-3 mb-lg-4 mb-3"
      variants={containerVariants} // ← Added missing container variants
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // ← Added 'once: true' for performance
    >
      <div className="container">
        <div className="row align-items-center">
          
          {/* Text Section */}
          <motion.div
            className="col-md-6 text-center text-md-start"
            variants={fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-3 text-white">
              Find Genuine <span className="text-success">Spare Parts</span> Easily
            </h1>
            <p className="lead mb-4 text-white">
              Discover nearby hardware shops, check availability, and track your
              vehicle's servicing—all in one place.
            </p>
            <motion.a 
              href="#category" 
              className="btn btn-lg btn-success px-4 py-2 rounded-pill"
              whileHover={{ scale: 1.05 }} // ← Added hover animation
              whileTap={{ scale: 0.95 }}   // ← Added tap animation
            >
              <i className="fas fa-search me-2"></i>
              Explore Brands
            </motion.a>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="col-md-6 text-center mt-4 mt-md-0"
            variants={fadeInRight}
          >
            <motion.img
              src="https://media.istockphoto.com/id/526209999/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=yXvzy425jTHSTKWxd7XCdIuh9zLLnTfNHD1jrRCwkrk="
              alt="Spare Parts"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "350px" }}
              whileHover={{ scale: 1.02 }} // ← Added subtle hover effect
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
