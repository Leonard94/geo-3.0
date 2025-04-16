import React, { useEffect, useState } from "react";
import { Polygon, Placemark } from "react-yandex-maps";
import {
  ExtendedMainPointDefinition,
  MainPointDefinition,
} from "../../../../store/rab/rabTypes";
import { RayConfigDrawer } from "./RayConfigDrawer/RayConfigDrawer";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { updateRab } from "../../../../store/rab/rabActions";
import { useActiveIncidentsStore } from "../../../../zustandStore/useActiveIncidentsStore";

const calculateCoordsByDistance = (
  startPoint: [number, number],
  distance: number,
  azimuth: number
): [number, number] => {
  const earthRadius = 6378137;

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const toDegrees = (radians: number) => radians * (180 / Math.PI);

  const lat1 = toRadians(startPoint[0]);
  const lon1 = toRadians(startPoint[1]);

  const bearingRad = toRadians(azimuth);

  const angularDistance = distance / earthRadius;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return [toDegrees(lat2), toDegrees(lon2)];
};

const createTriangleRay = (
  startPoint: [number, number],
  distance: number,
  azimuth: number,
  openingAngle = 30
): [number, number][] => {
  const leftAngle = azimuth - openingAngle / 2;
  const rightAngle = azimuth + openingAngle / 2;

  const leftPoint = calculateCoordsByDistance(startPoint, distance, leftAngle);
  const rightPoint = calculateCoordsByDistance(
    startPoint,
    distance,
    rightAngle
  );

  return [startPoint, leftPoint, rightPoint, startPoint];
};

const ensureColor = (
  color: string | undefined,
  defaultColor: string = "#FF0000"
): string => {
  if (!color || color === "") {
    return defaultColor;
  }
  return color;
};

interface IProps {
  rayMainPoints: MainPointDefinition[];
}

export const RayPolygons: React.FC<IProps> = ({ rayMainPoints }) => {
  const rabItems = useAppSelector((state) => state.rab.items);
  const activeRays = useActiveIncidentsStore((state) => state.activeRays);

  const initialExtendedPoints: ExtendedMainPointDefinition[] =
    rayMainPoints.map((point) => ({
      ...point,
      active: point.active !== false,
      pointColor: point.pointColor || "#000000",
      rayDefinitions:
        point.rayDefinitions?.map((ray) => ({
          ...ray,
          visible: ray.visible !== false,
        })) || [],
    }));

  const [polygonSets, setPolygonSets] = useState<
    {
      mainPoint: [number, number];
      polygons: [number, number][][];
      visiblePolygons: [number, number][][];
      color: string;
      isActive: boolean;
      pointColor: string;
    }[]
  >([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] =
    useState<ExtendedMainPointDefinition | null>(null);
  const [localRayMainPoints, setLocalRayMainPoints] = useState<
    ExtendedMainPointDefinition[]
  >(initialExtendedPoints);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const extendedPoints = rayMainPoints.map((point) => ({
      ...point,
      active: point.active !== false,
      pointColor: point.pointColor || "#000000",
      altitude: point.altitude || "0",
      rayDefinitions:
        point.rayDefinitions?.map((ray) => ({
          ...ray,
          visible: ray.visible !== false,
        })) || [],
    }));
    setLocalRayMainPoints(extendedPoints);
  }, [rayMainPoints]);

  useEffect(() => {
    const newPolygonSets = localRayMainPoints.map((point) => ({
      mainPoint: point.coordinates,
      polygons: (point.rayDefinitions || []).map((ray) =>
        createTriangleRay(
          point.coordinates,
          ray.distance,
          ray.azimuth,
          ray.openingAngle
        )
      ),
      visiblePolygons: (point.rayDefinitions || [])
        .filter((ray) => ray.visible !== false)
        .map((ray) =>
          createTriangleRay(
            point.coordinates,
            ray.distance,
            ray.azimuth,
            ray.openingAngle
          )
        ),
      color: point.color || "#FF000088",
      isActive: point.active !== false,
      pointColor: point.pointColor || "#000000",
    }));
    setPolygonSets(newPolygonSets);
  }, [localRayMainPoints, activeRays]);

  const handlePointClick = (point: ExtendedMainPointDefinition) => {
    setSelectedPoint(point);
    setIsDrawerOpen(true);
  };

  const handleUpdatePoint = (updatedPoint: ExtendedMainPointDefinition) => {
    const updatedPoints = localRayMainPoints.map((point) =>
      point.coordinates[0] === updatedPoint.coordinates[0] &&
      point.coordinates[1] === updatedPoint.coordinates[1]
        ? updatedPoint
        : point
    );
    setLocalRayMainPoints(updatedPoints);

    if (updatedPoint.id) {
      const originalItem = rabItems.find((item) => item.id === updatedPoint.id);

      if (originalItem) {
        const rayDefsJson = JSON.stringify(updatedPoint.rayDefinitions || []);

        const rabItem = {
          ...originalItem,
          id: updatedPoint.id,
          name: updatedPoint.name || originalItem.name || "",
          latitude: String(updatedPoint.coordinates[0]),
          longitude: String(updatedPoint.coordinates[1]),
          altitude: updatedPoint.altitude || originalItem.altitude || "0",
          color: updatedPoint.color || originalItem.color || "rgb(255, 0, 0)",
          active: updatedPoint.active ? "true" : "false",
          rayDefinitions: rayDefsJson,
          type: originalItem.type || "подавитель",
        };

        dispatch(updateRab(rabItem));
      }
    }
  };

  return (
    <>
      {polygonSets.map((pointSet, setIndex) => (
        <React.Fragment key={`point-set-${setIndex}`}>
          <Placemark
            geometry={pointSet.mainPoint}
            options={{
              preset: "islands#darkOrangeCircleDotIcon",
              iconColor: pointSet.isActive
                ? pointSet.pointColor || "#000000"
                : "#808080",
            }}
            properties={{
              iconCaption:
                localRayMainPoints[setIndex].name || `Точка ${setIndex + 1}`,
            }}
            onClick={() => handlePointClick(localRayMainPoints[setIndex])}
          />

          {pointSet.isActive &&
            pointSet.polygons.length > 0 &&
            pointSet.polygons.map((polygon, polygonIndex) => {
              const correspondingRay =
                localRayMainPoints[setIndex]?.rayDefinitions[polygonIndex];

              if (!correspondingRay) {
                return null;
              }

              const isVisible = pointSet.visiblePolygons.some(
                (visiblePolygon) =>
                  JSON.stringify(visiblePolygon) === JSON.stringify(polygon)
              );

              const rayId = `${localRayMainPoints[setIndex].id}-${polygonIndex}`;
              const isActive = useActiveIncidentsStore
                .getState()
                .isRayActive(rayId);

              let fillColor = isActive
                ? "rgba(255, 0, 0, 0.5)"
                : isVisible
                ? ensureColor(correspondingRay.color || pointSet.color)
                : "rgba(128, 128, 128, 0.5)";

              let strokeColor = isActive
                ? "rgba(255, 0, 0, 0.9)"
                : isVisible
                ? ensureColor(correspondingRay.color || pointSet.color).replace(
                    "88",
                    "FF"
                  )
                : "rgba(128, 128, 128, 0.9)";

              return (
                <Polygon
                  key={`polygon-${setIndex}-${polygonIndex}`}
                  geometry={[polygon]}
                  options={{
                    fillColor: fillColor,
                    strokeColor: strokeColor,
                    opacity: isVisible ? 0.5 : 0.4,
                    strokeWidth: isActive ? 3 : 2,
                    openHintOnHover: true,
                    interactivityModel: "default#transparent",
                  }}
                  properties={{
                    hintContent: `${
                      isActive ? "❗ ОБНАРУЖЕН ИНЦИДЕНТ! " : ""
                    }Название: ${
                      correspondingRay.name || `Луч ${polygonIndex + 1}`
                    }; Азимут: ${correspondingRay.azimuth}°; Расстояние: ${
                      correspondingRay.distance
                    }м`,
                  }}
                />
              );
            })}
        </React.Fragment>
      ))}

      {selectedPoint && (
        <RayConfigDrawer
          isOpen={isDrawerOpen}
          point={selectedPoint}
          onClose={() => setIsDrawerOpen(false)}
          onUpdate={handleUpdatePoint}
        />
      )}
    </>
  );
};
