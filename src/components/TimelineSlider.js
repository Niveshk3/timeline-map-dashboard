import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TimelineSlider = ({ max, value, onChange, isPlaying, setIsPlaying }) => {
  return (
    <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "1rem" }}>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause ⏸️" : "Play ▶️"}
      </button>
      <Slider
        min={0}
        max={max}
        value={value}
        onChange={onChange}
        style={{ flex: 1 }}
      />
      <span>Hour: {value}</span>
    </div>
  );
};

export default TimelineSlider;
