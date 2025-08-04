const CategoryContainer = () => {
  return (
    <div
      className="border rounded shadow-sm text-white shop-container"
      style={{
        minWidth: '140px',
        minHeight: '130px',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src="src/assets/shop.png"
        alt="Auto Shop"
        style={{ height: '80px', width: '80px', objectFit: 'cover' }}
      />
      <p className="fw-bold medium mt-2">Auto Parts Shop</p>
    </div>
  );
};

export default CategoryContainer;
