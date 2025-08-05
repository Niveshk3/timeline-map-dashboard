import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import TimelineSlider from "./components/TimelineSlider";
import "./App.css";

function App() {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="app-container">
      <div className="timeline-slider">
        <TimelineSlider
          value={timelineIndex}
          onChange={setTimelineIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
      <div className="map-wrapper">
        <MapComponent timelineIndex={timelineIndex} />
      </div>
    </div>
  );
}

export default App;

