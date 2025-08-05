import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TimelineSlider = ({ value, onChange, isPlaying, setIsPlaying }) => {
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "⏸️ Pause" : "▶️ Play"}
      </button>
      <Slider
        min={0}
        max={335}
        value={value}
        onChange={onChange}
        style={{ flexGrow: 1 }}
      />
      <span>Hour: {value}</span>
    </>
  );
};

export default TimelineSlider;
