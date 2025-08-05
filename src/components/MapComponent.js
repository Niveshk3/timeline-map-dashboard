import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TimelineSlider from "./TimelineSlider";
import { fetchWeatherData } from "../utils/api";

const MapEvents = ({ onClick, onDoubleClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
    dblclick() {
      onDoubleClick();
    },
  });
  return null;
};

const getPolygonCentroid = (latlngs) => {
  let latSum = 0, lngSum = 0;
  latlngs.forEach(([lat, lng]) => {
    latSum += lat;
    lngSum += lng;
  });
  return {
    lat: latSum / latlngs.length,
    lng: lngSum / latlngs.length,
  };
};

const getColor = (value) => {
  if (value < 10) return "red";
  if (value >= 10 && value < 25) return "blue";
  return "green";
};

const MapComponent = ({ dataSource }) => {
  const [polygons, setPolygons] = useState(() => {
    const saved = localStorage.getItem("polygons");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [timelineIndex, setTimelineIndex] = useState(() => {
    const saved = localStorage.getItem("timelineIndex");
    return saved ? parseInt(saved) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("polygons", JSON.stringify(polygons));
  }, [polygons]);

  useEffect(() => {
    localStorage.setItem("timelineIndex", timelineIndex);
  }, [timelineIndex]);

  const handleMapClick = (latlng) => {
    setCurrentPolygon((prev) => [...prev, [latlng.lat, latlng.lng]]);
  };

  const handleMapDoubleClick = () => {
    if (currentPolygon.length >= 3) {
      const label = prompt("Enter a label for this polygon:");
      const { lat, lng } = getPolygonCentroid(currentPolygon);
      fetchWeatherData(lat, lng, "2025-07-18", "2025-08-01", dataSource).then(
        (data) => {
          setPolygons((prev) => [
            ...prev,
            {
              label: label || `Polygon ${prev.length + 1}`,
              coordinates: currentPolygon,
              values: data,
            },
          ]);
        }
      );
      setCurrentPolygon([]);
    }
  };

  const deletePolygon = (index) => {
    const updated = polygons.filter((_, i) => i !== index);
    setPolygons(updated);
  };

  // Animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimelineIndex((prev) => (prev + 1) % 336); // loop through hours
      }, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  return (
    <>
      <MapContainer
        center={[20.59, 78.96]}
        zoom={5}
        style={{ height: "80vh", width: "100%" }}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents
          onClick={handleMapClick}
          onDoubleClick={handleMapDoubleClick}
        />

        {polygons.map((poly, index) => (
          <Polygon
            key={index}
            positions={poly.coordinates}
            pathOptions={{
              fillColor: getColor(poly.values?.[timelineIndex] || 0),
              fillOpacity: 0.6,
              color: "black",
            }}
          >
            <Tooltip>{poly.label}</Tooltip>
          </Polygon>
        ))}

        {currentPolygon.length > 0 && (
          <Polygon
            positions={currentPolygon}
            pathOptions={{ color: "red", dashArray: "5,5", fillOpacity: 0.3 }}
          />
        )}
      </MapContainer>

      <TimelineSlider
        max={335}
        value={timelineIndex}
        onChange={setTimelineIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      <div className="legend">
        <strong>Legend:</strong>
        <div><span style={{ color: "red" }}>⬤</span> &lt; 10</div>
        <div><span style={{ color: "blue" }}>⬤</span> 10 - 25</div>
        <div><span style={{ color: "green" }}>⬤</span> &gt; 25</div>
      </div>

      <div style={{ padding: "10px" }}>
        <h4>Drawn Polygons</h4>
        {polygons.map((poly, index) => (
          <div key={index}>
            {poly.label}{" "}
            <button onClick={() => deletePolygon(index)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default MapComponent;
