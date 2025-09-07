import {} from "react";
import MapLayer from "./components/MapLayer";
import UiLayer from "./components/UiLayer";
import useLoadData from "./hook/useLoadData";
import { MapProvider } from "./context";

function App() {
  useLoadData();
  return (
    <MapProvider>
      <div className="w-full h-full">
        <MapLayer />
        <UiLayer />
      </div>
    </MapProvider>
  );
}

export default App;
