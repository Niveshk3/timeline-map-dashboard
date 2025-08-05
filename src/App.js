import React, { useState } from "react";
import MapComponent from "./components/MapComponent";

function App() {
  const [dataSource, setDataSource] = useState("temperature_2m");

  return (
    <div>
      <h2>🌍 Timeline Map Dashboard</h2>
      <label>
        Dataset:
        <select onChange={(e) => setDataSource(e.target.value)}>
          <option value="temperature_2m">Temperature</option>
          <option value="humidity_2m">Humidity</option>
          <option value="wind_speed_10m">Wind Speed</option>
        </select>
      </label>
      <MapComponent dataSource={dataSource} />
    </div>
  );
}

export default App;
