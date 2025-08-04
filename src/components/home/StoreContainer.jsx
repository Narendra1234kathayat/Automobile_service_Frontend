
const StoreScroller = () => {
  return (
    <div
      className="border rounded shadow-sm  text-white shop-container"
      style={{ minWidth: '220px', minHeight: '120px', flex: '0 0 auto' }}
    >
      <div className="d-flex align-items-center p-2">
        <img
          src="src/assets/shop.png"
          alt="Auto Shop"
          style={{ height: '80px', width: '80px', objectFit: 'cover' }}
          className="me-3"
        />
        <div>
          <p className="fw-bold mb-1 fs-5 fs-md-4 fs-lg-3">Auto Parts Shop</p>
          <p className="mb-0 medium">Vadodara</p>
        </div>
      </div>
    </div>
  );
};

export default StoreScroller;
