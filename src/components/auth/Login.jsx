import '../auth/Login.css';

function Login() {
  return (
    <div className="d-flex vh-100">

     {/* Left Side Of Page */}
<div className="w-50 d-flex align-items-center justify-content-center leftside-bg">
  <div
    className="w-100"
    style={{
      maxWidth: '420px',
      padding: '2rem',
    }}
  >
    <h3 className="fw-bold text-white mb-4">Welcome back</h3>

    {/* Login Form */}
    <form>
      <div className="mb-3">
        <label htmlFor="email" className="form-label text-light">Email</label>
        <input
          type="email"
          className="form-control bg-dark text-white border-0"
          id="email"
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label text-light">Password</label>
        <input
          type="password"
          className="form-control bg-dark text-white border-0"
          id="password"
          placeholder="Enter your password"
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check text-light">
          <input type="checkbox" className="form-check-input" id="rememberMe" />
          <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
        </div>
        <a href="#" className="text-success text-decoration-none">Forgot password?</a>
      </div>

      <button type="submit" className="btn btn-success w-100 fw-semibold">
        Sign in to your account
      </button>
    </form>

    <div className="text-start mt-4">
      <span className="text-light">
        Don’t have an account?{' '}
        <a href="#" className="text-success text-decoration-none fw-semibold">Sign up</a>
      </span>
    </div>
  </div>
</div>


      {/* Right Side Of Page */}
<div className="w-50 d-flex align-items-center justify-content-start rightside-bg p-5">
  <div className="d-flex flex-column gap-3 text-white" style={{ maxWidth: '500px' }}>
    
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
</div>

    </div>
  );
}

export default Login;
