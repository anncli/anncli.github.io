import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const Map = ({ markers }) => {
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    const map = L.map("map");
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Use explicit Leaflet icon with correct anchor
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [22, 35],
      iconAnchor: [11, 10], // Adjust icon offset
      popupAnchor: [0, -5],
      tooltipAnchor: [16, -28],
      shadowSize: [35, 35],
    });
    markerRefs.current = markers.map(({ city, lat, lng, sentence }) => {
      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      marker.bindPopup(`<strong>${city}</strong><br>${sentence}`);
      let clicked = false;
      marker.on('mouseover', function() { if (!clicked) marker.openPopup(); });
      marker.on('mouseout', function() { if (!clicked) marker.closePopup(); });
      marker.on('click', function() { clicked = true; marker.openPopup(); });
      marker.on('popupclose', function() { clicked = false; });
      return marker;
    });

    // Fit map to bounds of all markers
    const bounds = L.latLngBounds(markers.map(({ lat, lng }) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
    map.invalidateSize();

    return () => map.remove();
  }, [markers]);

  // City list click handler
  const handleCityClick = (idx) => {
    const marker = markerRefs.current[idx];
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), 7, { animate: true });
      marker.openPopup();
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div id="map" style={{ height: "400px", width: "100%" }} />
      <div style={{ minWidth: "180px", maxHeight: "400px", overflowY: "auto", padding: "0 1rem" }}>
        <h4>Cities List</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {markers.map((m, idx) => (
            <li key={m.city} style={{ cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => handleCityClick(idx)}>
              {m.city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;
