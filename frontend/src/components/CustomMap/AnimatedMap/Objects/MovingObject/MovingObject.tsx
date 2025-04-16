import React, { memo, useEffect, useState, useMemo } from "react";
import { Circle, Placemark, Polyline } from "react-yandex-maps";
import { IPoint } from "../../../../../pages/MapPage/CustomMap/types";
import { useActiveIncidentsStore } from "../../../../../zustandStore/useActiveIncidentsStore";
import { useAppSelector } from "../../../../../store/hooks";

type MovingObjectProps = {
  id: string;
  trajectory: [number, number][];
  color: string;
  speed: number; // Speed multiplier km/h
  distance?: number; //meters
  updateInterval?: number; //
  points: IPoint[];
  title: string;
  incidentType: string;
};

const setColorOpacity = (color: string) => {
  return color.replace("rgb", "rgba").replace(")", ", 0.05)");
};

const calculateNewPoint = (
  start: [number, number],
  end: [number, number],
  distance: number
): [number, number] => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const toDeg = (value: number) => (value * 180) / Math.PI;

  const [lat1, lon1] = start;
  const [lat2, lon2] = end;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);

  const R = 6371000;

  const newLat = Math.asin(
    Math.sin(toRad(lat1)) * Math.cos(distance / R) +
      Math.cos(toRad(lat1)) * Math.sin(distance / R) * Math.cos(bearing)
  );
  const newLon =
    toRad(lon1) +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(toRad(lat1)),
      Math.cos(distance / R) - Math.sin(toRad(lat1)) * Math.sin(newLat)
    );

  return [toDeg(newLat), toDeg(newLon)];
};

const haversineDistance = (
  point1: [number, number],
  point2: [number, number]
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Добавляем функцию для проверки, находится ли точка внутри сектора луча
const isPointInRaySector = (
  point: [number, number],
  sourcePoint: [number, number],
  azimuth: number,
  openingAngle: number,
  distance: number
): boolean => {
  // 1. Проверяем дистанцию
  const actualDistance = haversineDistance(sourcePoint, point);
  if (actualDistance > distance) {
    return false; // Точка находится дальше, чем может видеть луч
  }

  // 2. Проверяем, находится ли точка в правильном секторе
  // Вычисляем азимут от источника до точки
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const toDeg = (radians: number) => (radians * 180) / Math.PI;

  const lat1 = toRad(sourcePoint[0]);
  const lon1 = toRad(sourcePoint[1]);
  const lat2 = toRad(point[0]);
  const lon2 = toRad(point[1]);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  let bearing = toDeg(Math.atan2(y, x));
  // Нормализуем до 0-360
  bearing = (bearing + 360) % 360;

  // Нормализуем азимут луча
  const normalizedAzimuth = (azimuth + 360) % 360;

  // Определяем границы сектора
  const halfAngle = openingAngle / 2;
  let minAzimuth = normalizedAzimuth - halfAngle;
  let maxAzimuth = normalizedAzimuth + halfAngle;

  // Обрабатываем случаи, когда сектор пересекает 0/360 градусов
  if (minAzimuth < 0) {
    minAzimuth += 360;
    // Если минимальный угол корректируется на 360, нам нужно проверить двумя способами
    return (
      (bearing >= minAzimuth && bearing <= 360) ||
      (bearing >= 0 && bearing <= maxAzimuth)
    );
  } else if (maxAzimuth > 360) {
    maxAzimuth -= 360;
    // Если максимальный угол корректируется на 360, нам нужно проверить двумя способами
    return (
      (bearing >= minAzimuth && bearing <= 360) ||
      (bearing >= 0 && bearing <= maxAzimuth)
    );
  }

  // Стандартная проверка
  return bearing >= minAzimuth && bearing <= maxAzimuth;
};

export const MovingObject: React.FC<MovingObjectProps> = memo(
  ({
    id,
    trajectory,
    title,
    incidentType,
    color,
    speed,
    distance = 525000,
    updateInterval = 2000,
    points,
  }) => {
    const [position, setPosition] = useState<[number, number]>(trajectory[0]); // Start position
    const [radius, setRadius] = useState(distance); // Initial radius based on distance
    const [newPointB, setNewPointB] = useState<[number, number]>(trajectory[1]); // Default to the original Point B

    const rabItems = useAppSelector((state) => state.rab.items);
    const activeDetectors = useMemo(
      () =>
        rabItems.filter(
          (item) => item.active === "true" && item.type === "обнаружитель"
        ),
      [rabItems]
    );

    useEffect(() => {
      if (trajectory.length === 2) {
        const [pointA, pointB] = trajectory;
        const calculatedPointB = calculateNewPoint(pointA, pointB, distance);
        setNewPointB(calculatedPointB); // Update Point B based on distance
      } else {
        console.error("Invalid trajectory: must have exactly two points.");
      }
    }, [trajectory, distance]);

    useEffect(() => {
      if (!trajectory || trajectory.length !== 2 || !newPointB) {
        console.error("Invalid trajectory: must have exactly two points.");
        return;
      }

      let intervalId: NodeJS.Timeout | null = null;
      const [start] = trajectory as [[number, number], [number, number]];
      const end = newPointB;
      let progress = 0; // Initialize progress (0 to 1)
      const totalDistance = haversineDistance(start, end); // Total distance in meters
      const speedMps = speed / 3.6; // Convert km/h to m/s

      let lastUpdateTime = Date.now(); // Track the last update time

      const interpolate = (
        start: [number, number],
        end: [number, number],
        t: number
      ): [number, number] => {
        return [
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t,
        ];
      };

      const updatePosition = () => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - lastUpdateTime) / 1000; // Elapsed time in seconds
        lastUpdateTime = currentTime;

        const distanceTraveled = speedMps * elapsedTime; // Distance traveled in this interval
        const stepProgress = distanceTraveled / totalDistance; // Fraction of the total distance covered

        progress += stepProgress; // Increment progress

        if (progress >= 1) {
          clearInterval(intervalId!); // Stop the interval when trajectory is complete
          progress = 1; // Clamp progress to 1
        }

        const newPosition: [number, number] = interpolate(start, end, progress);

        const remainingDistance = totalDistance * (1 - progress); // Calculate remaining distance
        setPosition(newPosition);
        setRadius(remainingDistance); // Update radius to reflect remaining distance

        const reachable = points
          .filter(
            (point) =>
              haversineDistance(newPosition, point.geometry.coordinates) <=
              remainingDistance
          )
          .map((point) => point.id);

        // Update the Zustand store
        useActiveIncidentsStore.getState().addActiveIncidents(id, reachable);

        useActiveIncidentsStore.getState().clearIncidentFromAllRays(id);

        activeDetectors.forEach((detector) => {
          try {
            const rayDefinitions = JSON.parse(
              String(detector.rayDefinitions) || "[]"
            );
            const detectorPosition: [number, number] = [
              parseFloat(String(detector.latitude)),
              parseFloat(String(detector.longitude)),
            ];

            rayDefinitions.forEach((ray: any, rayIndex: number) => {
              if (ray.visible === false) {
                return;
              }

              const isDetected = isPointInRaySector(
                newPosition,
                detectorPosition,
                ray.azimuth,
                ray.openingAngle,
                ray.distance
              );

              const rayId = `${detector.id}-${rayIndex}`;

              if (isDetected) {
                useActiveIncidentsStore
                  .getState()
                  .addActiveRayDetection(rayId, id);
              }
            });
          } catch (error) {
            console.error("Ошибка при обработке лучей:", error);
          }
        });

        if (progress >= 1) {
          useActiveIncidentsStore.getState().clearActiveIncident(id);
          useActiveIncidentsStore.getState().clearIncidentFromAllRays(id);
        }
      };

      intervalId = setInterval(updatePosition, updateInterval);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [
      trajectory,
      newPointB,
      speed,
      updateInterval,
      activeDetectors,
      points,
      id,
      title,
    ]);

    return (
      <>
        {/* Trajectory */}
        <Polyline
          geometry={[trajectory[0], newPointB]}
          options={{
            strokeColor: color,
            strokeWidth: 4,
            strokeOpacity: 0.8,
          }}
        />

        {/* Moving object */}
        <Placemark
          geometry={position}
          options={{
            preset: "islands#circleDotIcon",
            iconColor: color,
          }}
          properties={{
            hintContent: `${title}`,
            balloonContent: `
              <div>
                <b>${title}</b><br/>
                Тип: ${incidentType}<br/>
                Скорость: ${speed} км/ч <br/>
                Id: ${id}
              </div>
            `,
          }}
        />
        <Circle
          geometry={[position, radius]}
          options={{
            fillColor: setColorOpacity(color),
            strokeColor: color, // Red border
            strokeWidth: 2, // Border width
          }}
        />
      </>
    );
  }
);
