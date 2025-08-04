const ProductContainer = () => {
  return (
    <div
      className="border rounded shadow-sm  d-flex flex-column flex-md-row align-items-center p-3 mb-4 shop-container"
      style={{ maxWidth: '700px' }}
    >
      {/* Left Side: Image */}
      <img
        src="src/assets/shop.png"
        alt="Product"
        style={{ height: '120px', width: '120px', objectFit: 'cover' }}
        className="me-md-4 mb-3 mb-md-0"
      />

      {/* Right Side: Info + Buttons */}
      <div className="flex-grow-1 text-center text-md-start">
        <h5 className="mb-2 text-white">Product Name</h5>
        <p className="mb-3 fw-bold text-white">₹999</p>

        <div className="d-flex justify-content-center justify-content-md-start gap-2">
          <button className="btn btn-outline-primary btn-sm">Add to Cart</button>
          <button className="btn btn-primary btn-sm">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductContainer;
