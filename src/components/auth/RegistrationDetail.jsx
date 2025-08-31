import React from "react";
import RightSideBanner from "./RightSideBanner.jsx";

const RegistrationDetail = ({ step,setStep, form, handleChange, handleSubmit }) => {
  return (
    <div className="col-lg-6 col-12 align-items-center d-flex   justify-content-center  rightside-bg p-5">
      {step === 1 ? (
        <RightSideBanner />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "420px" }}
        >
          <h4 className="fw-bold text-white mb-3 d-flex justify-content-between">Additional Details  <button className="btn btn-light" onClick={()=>setStep(1)}>back</button></h4>
         
          {/* Conditional */}
          {form.role === "mechanic" && (
            <>
              <div className="mb-3">
                <label className="form-label text-light">Workshop Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-0"
                  name="workshopName"
                  value={form.workshopName}
                  onChange={handleChange}
                  placeholder="Enter your workshop name"
                />
              </div>

              {/* <div className="mb-3">
                <label className="form-label text-light">
                  Years of Experience
                </label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-0"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Enter your experience"
                />
              </div> */}
            </>
          )}

          {form.role === "supplier" && (
            <div className="mb-3">
              <label className="form-label text-light">Garage/Store Name</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-0"
                name="garageName"
                value={form.garageName}
                onChange={handleChange}
                placeholder="Enter your garage/store name"
              />
            </div>
          )}

          {/* Address */}
          <h5 className="text-light mt-4">Address Details</h5>
          <div className="mb-3">
            <label className="form-label text-light">Street</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Enter street"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">City</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">State</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Country</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Pincode</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Submit Registration
          </button>
        </form>
      )}
    </div>
  );
};

export default RegistrationDetail;
