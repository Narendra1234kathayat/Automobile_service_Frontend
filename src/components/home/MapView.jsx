import React, { useEffect, useRef } from 'react';

const MapView = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('googleMaps');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAcxvuRQgxICXW50XKQl13JusdxvM-1zFM`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeMap();
        };
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.google) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = new window.google.maps.LatLng(latitude, longitude);

          const map = new window.google.maps.Map(mapRef.current, {
            center: userLocation,
            zoom: 15,
          });

          new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'You are here!',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Location access denied. Showing default location.');
          const defaultLocation = new window.google.maps.LatLng(21.1702, 72.8311); // Surat fallback
          const map = new window.google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
          });
        }
      );
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
      ></div>
    </div>
  );
};

export default MapView;