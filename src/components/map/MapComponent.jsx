import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socket from "../../socket/SocketUser.js";

// Fix marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const userId=JSON.parse(localStorage.getItem('user'));

const MapComponent = () => {
  const [myPosition, setMyPosition] = useState([22.3000, 73.2065]);
  const [others, setOthers] = useState([]);
  const mapRef = useRef();

  // Register the user
  // useEffect(() => {
  //   socket.emit("register", userId);
  // }, []);

  // Get current & real-time location
  useEffect(() => {
    if ("geolocation" in navigator) {
     navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyPosition([latitude, longitude]);
        },
        (err) => console.error("Initial location error:", err),
        { enableHighAccuracy: true }
      );

      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setMyPosition(coords);

          // Include userId in the broadcast for mapping
          socket.emit("send-location", {
            userId,
            coords,
          });
        },
        (err) => console.error("Watch location error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Center map on my position
  useEffect(() => {
    if (mapRef.current && myPosition[0] !== 0) {
      mapRef.current.setView(myPosition, 14);
    }
  }, [myPosition]);

  // Listen for other users' positions
  useEffect(() => {
    socket.on("receive-location", ({ userId: otherId, coords }) => {
      setOthers((prev) => {
        const filtered = prev.filter((user) => user.userId !== otherId);
        return [...filtered, { userId: otherId, coords }];
      });
    });

    return () => socket.off("receive-location");
  }, []);

  // // Optionally listen to alerts
  // useEffect(() => {
  //   socket.on("receive_alert", ({ from, message }) => {
  //     alert(`🚨 Alert from ${from}: ${message}`);
  //   });

  //   return () => socket.off("receive_alert");
  // }, []);

  return (
    <div>
      <h3>📍 Real-Time Map - {userId}</h3>
      <p>Latitude: {myPosition[0]}, Longitude: {myPosition[1]}</p>

      <MapContainer
        center={myPosition}
        zoom={13}
        style={{ height: "60vh", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={myPosition}>
          <Popup>{userId} (You)</Popup>
        </Marker>

        {others.map(({ userId, coords }, index) => (
          <Marker key={index} position={coords}>
            <Popup>{userId}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
