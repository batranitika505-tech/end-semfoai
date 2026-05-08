import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom ISS Icon
const issIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative">
          <div class="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping"></div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg" 
               class="w-10 h-10 relative drop-shadow-2xl" 
               alt="ISS" />
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const ISSMap = ({ location, history = [] }) => {
  if (!location) {
    return (
      <div className="w-full h-[450px] bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center rounded-2xl">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 font-bold animate-pulse">Acquiring Orbital Lock...</p>
      </div>
    );
  }

  // Use last 15 positions for polyline as requested
  const path = history.slice(-15).map(p => [p.lat, p.lng]);

  return (
    <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-heavy">
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={3} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={path} color="#ef4444" weight={3} opacity={0.6} dashArray="5, 10" />
        <Marker position={[location.lat, location.lng]} icon={issIcon}>
          <Popup>
            <div className="text-xs font-bold">
              ISS Current Position<br/>
              Lat: {location.lat.toFixed(4)}<br/>
              Lng: {location.lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>
        <RecenterMap lat={location.lat} lng={location.lng} />
      </MapContainer>
    </div>
  );
};

export default ISSMap;
