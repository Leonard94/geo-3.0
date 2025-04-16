import { useRef } from "react";
import { YMaps, Map, Polygon } from "react-yandex-maps";
import { Objects } from "./Objects";

const mapState = {
  center: [55.73, 37.9],
  zoom: 10,
};

const coor = [
  [
    [55.65631062406688, 37.96591796874993],
    [55.72147468567632, 37.90411987304685],
    [55.77027618584105, 38.05518188476558],
    [55.671835770086055, 38.11560668945309],
    [55.65631062406688, 37.96591796874993],
  ],
];

export const AnimatedMap = () => {
  const mapRef = useRef<any>(null);

  return (
    <YMaps>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Map
          defaultState={mapState}
          instanceRef={(instance) => {
            if (instance) {
              mapRef.current = instance; // Store the map instance
            }
          }}
          modules={["geoObject.addon.editor"]}
          width="100%"
          height="100%"
        >
          <Polygon
            geometry={coor}
            options={{
              editorDrawingCursor: "crosshair",
              editorMaxPoints: 5,
              fillColor: "rgba(0, 255, 0, 0.5)",
              strokeColor: "rgba(0, 0, 255, 0.8)",
              strokeWidth: 4,
            }}
          />
          <Objects points={[]} />
        </Map>
      </div>
    </YMaps>
  );
};
