import './Login.css'
const RightSideBanner =()=>{
    return(
 <div className="d-lg-flex d-none flex-column gap-3 text-white" style={{ maxWidth: '500px' }}>

          {/* Logo and Title */}
          <div className="d-flex align-items-center gap-3">
            <img
              src="https://www.shutterstock.com/image-vector/car-icons-vintage-cars-unique-600nw-2443917033.jpg"
              alt="logo"
              className="logo"
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h2 className="fw-bold m-0">Automobile Service</h2>
          </div>

          {/* Main Tagline */}
          <h1 className="fw-bold m-0" style={{ fontSize: '2rem' }}>
            Bringing the Garage to You — Wherever You Are.
          </h1>

          {/* Subtext */}
          <p className="fs-6 m-0 text-light">
            Thousands of vehicle owners across the country trust <strong>website name</strong> to keep them moving — from emergency repairs to routine servicing, all delivered with speed, reliability, and convenience.
          </p>
        </div>
    );
};
export default RightSideBanner;