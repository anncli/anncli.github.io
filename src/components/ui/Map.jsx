import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const Map = ({ markers }) => {
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [selectedIdx, setSelectedIdx] = React.useState(null);

  useEffect(() => {
    const map = L.map("map");
    mapRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; <a href='https://carto.com/attributions'>CARTO</a>"
    }).addTo(map);

    // Use explicit Leaflet icon with correct anchor
    // Use a muted blue marker icon for black & white map
    const defaultIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
      iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
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
    setSelectedIdx(idx);
    const marker = markerRefs.current[idx];
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), 7, { animate: true });
      marker.openPopup();
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div id="map" style={{ maxHeight: "25rem", width: "100%" }} />
      <div style={{ minWidth: "10rem", maxHeight: "25rem", overflowY: "auto", padding: "0 0.7rem" }}>
        <h4 style={{ marginTop: "0.8rem" }}>Cities List</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {markers.map((m, idx) => (
            <li
              key={m.city}
              style={{
                cursor: "pointer",
                fontWeight: selectedIdx === idx ? "bold" : undefined,
                transition: "background 0.2s"
              }}
              onClick={() => handleCityClick(idx)}
            >
              {m.city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;
// Custom style for Leaflet popup font size
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .leaflet-popup-content {
      font-size: 0.85em;
      line-height: 1.15;
      max-width: 15em;
      word-break: break-word;
      margin: 1em 1.2em;
    }
  `;
  document.head.appendChild(style);
}
