import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Map,
  YMaps,
  ZoomControl,
  ObjectManager,
  ObjectManagerFeature,
} from "react-yandex-maps";
import styles from "./styles.module.scss";
import { MAP_SETTINGS, mapSettings } from "./mapSettings";
import { IPoint } from "./types";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Editor } from "./Editor/Editor";
import { Sidebar } from "./Sidebar/Sidebar";
import { Box, CircularProgress } from "@mui/material";
import { Objects } from "../../../components/CustomMap/AnimatedMap/Objects";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchObjects } from "../../../store/objects/objectsActions";
import { SwappableList } from "./SwappableList/SwappableList";
import { fetchEmployees } from "../../../store/employees/employeesActions";
import { fetchIncidents } from "../../../store/incidents/incidentsActions";
import { fetchCustomObjectTypes } from "../../../store/customObjectTypes/customObjectTypesActions";
import { fetchCustomIncidentTypes } from "../../../store/customIncidentsTypes/customIncidentsTypesActions";
import { RayPolygons } from "./RayPolygons/RayPolygons";
import { MainPointDefinition } from "../../../store/rab/rabTypes";
import { fetchRab } from "../../../store/rab/rabActions";

const svgIcon = `data:image/svg+xml;charset=UTF-8;base64,${btoa(
  `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="40" cy="40" r="34.5" fill="#B3B3B3" stroke="white"/>
<circle cx="40.5" cy="40.5" r="27.5" fill="white"/>
</svg>`
)}`;

export const CustomMap: React.FC = () => {
  const apikey = import.meta.env.VITE_YANDEX_API_KEY || "";

  const objectTypes = useAppSelector((state) => state.objectTypes.items);
  const objects = useAppSelector((state) => state.objects.items);
  const rabItems = useAppSelector((state) => state.rab.items);
  const dispatch = useAppDispatch();

  const [points, setPoints] = useState<IPoint[]>([]);
  const [isFilteredMode, setIsFilteredMode] = useState(false);
  const [, setFilteredPoints] = useState<IPoint[]>([]);
  const [editingPoint, setEditingPoint] = useState<IPoint | null>(null);
  const [isShowLoading, setIsShowLoading] = useState(true);
  const [isOpenEditPoint, setIsOpenEditPoint] = useState(false);
  const [isPointModeActive, setIsPointModeActive] = useState(false);

  useEffect(() => {
    dispatch(fetchObjects());
    dispatch(fetchEmployees());
    dispatch(fetchIncidents());
    dispatch(fetchRab());
  }, []);

  useEffect(() => {
    const objectsToPoints: IPoint[] = objects.map((data) => {
      const newPoint: IPoint = {
        id: data.id,
        type: "Feature",
        title: data.name as string,
        address: "-",
        comment: "-",
        validity: data.active === "true",
        objectType: data.type as string,
        geometry: {
          type: "Point",
          coordinates: [Number(data.latitude), Number(data.longitude)],
        },
        properties: {
          balloonContentHeader: data.name as string,
          balloonContentBody: `Описание: ${data.description}`,
          clusterCaption: data.name as string,
        },
      };

      return newPoint;
    });

    setPoints(objectsToPoints);
  }, [objects]);

  const mappedRayPoints = useMemo<MainPointDefinition[]>(() => {
    return rabItems.map((item) => {
      let rayDefs = [];
      try {
        rayDefs = JSON.parse(String(item.rayDefinitions) || "[]");
      } catch (e) {
        console.error("Ошибка при парсинге лучей:", e);
      }

      return {
        id: item.id,
        name: item.name as string,
        coordinates: [
          parseFloat(String(item.latitude)),
          parseFloat(String(item.longitude)),
        ],
        rayDefinitions: rayDefs,
        color: String(item.color),
        pointColor: String(item.color),
        active: item.active === "true",
        altitude: String(item.altitude)
      };
    });
  }, [rabItems]);

  const objectManagerRef = useRef<any>(null);

  const onMapClick = (e: any) => {
    if (!isPointModeActive) {
      return;
    }

    const coords = e.get("coords");

    const newPoint: IPoint = {
      id: Date.now().toString(),
      title: "Новая точка",
      validity: true,
      address: "",
      comment: "",
      objectType: "Новый тип",
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [coords[0], coords[1]],
      },
      properties: {
        balloonContentHeader: "Новая точка",
        balloonContentBody: "Адрес: не указан<br>Комментарий: не указан",
        balloonContentFooter: "",
        clusterCaption: "Новая точка",
      },
    };
    setPoints([...points, newPoint]);
  };

  const onEdit = (point: IPoint) => {
    setEditingPoint(point);
    setIsOpenEditPoint(true);
  };

  const handleCloseModal = () => {
    setIsOpenEditPoint(false);
    setEditingPoint(null);
  };

  const handleOpenNewPointModal = () => {
    setEditingPoint(null);
    setIsOpenEditPoint(true);
  };

  const onPointsUpdate = (newPoints: IPoint[]) => {
    setPoints(newPoints);
  };

  const onDelete = (pointId: string) => {
    setPoints((prevPoints) =>
      prevPoints.filter((point) => point.id !== pointId)
    );
    setFilteredPoints((prevFilteredPoints) =>
      prevFilteredPoints.filter((point) => point.id !== pointId)
    );
  };

  const handleBalloonEvent = (e: any) => {
    const target = e.target as HTMLElement;
    if (!target || !target.id) return;

    const [action, id] = target.id.split("_");
    const point = points.find((p) => p.id === id);

    if (!point) return;

    if (action === "editButton") {
      onEdit(point);
    } else if (action === "deleteButton") {
      onDelete(point.id);
    }

    objectManagerRef.current?.objects.balloon.close();
  };

  const onSubmitEditor = (data: any) => {
    if (editingPoint) {
      setPoints(
        points.map((item) => {
          if (item.id === editingPoint.id) {
            return {
              ...item,
              ...data,
              properties: {
                ...item.properties,
                balloonContentHeader: data.title,
                balloonContentBody: `Адрес: ${data.address}<br>Комментарий: ${data.comment}`,
              },
            };
          }
          return item;
        })
      );
    } else {
      const newPoint = {
        ...data,
        id: Date.now().toString(),
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            data.geometry.coordinates[0],
            data.geometry.coordinates[1],
          ],
        },
        properties: {
          balloonContentHeader: data.title,
          balloonContentBody: `Адрес: ${data.address}<br>Комментарий: ${data.comment}`,
          clusterCaption: data.title,
        },
      };
      setPoints([...points, newPoint]);
    }
    handleCloseModal();
  };

  const displayedPoints = isFilteredMode
    ? points.filter((point) => point.validity)
    : points;

  useEffect(() => {
    dispatch(fetchObjects());
    dispatch(fetchEmployees());
    dispatch(fetchIncidents());
    dispatch(fetchCustomObjectTypes());
    dispatch(fetchCustomIncidentTypes());
  }, []);

  return (
    <div className={styles.custom_map}>
      <Sidebar
        onEdit={onEdit}
        pointsList={points}
        setPoints={setPoints}
        isFilteredMode={isFilteredMode}
        setFilteredPoints={setFilteredPoints}
        handleOpenNewPointModal={handleOpenNewPointModal}
        setIsFilteredMode={setIsFilteredMode}
        onTogglePointMode={() => setIsPointModeActive(!isPointModeActive)}
        isPointModeActive={isPointModeActive}
        onPointsUpdate={onPointsUpdate}
      />

      <div className={styles.map_content}>
        {isShowLoading && (
          <Box className={styles.loader}>
            <CircularProgress />
          </Box>
        )}
        {true && (
          <YMaps
            query={{ apikey, load: "package.full" }}
            onLoad={() => {
              setIsShowLoading(false);
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <SwappableList />
              <Map
                modules={["multiRouter.MultiRoute"]}
                defaultState={{ center: MAP_SETTINGS.center, zoom: MAP_SETTINGS.zoom }}
                onClick={onMapClick}
                width="100%"
                height="100%"
                options={mapSettings.options}
                state={mapSettings.state}
                onLoad={() => {
                  setIsShowLoading(false);
                }}
              >
                <RayPolygons rayMainPoints={mappedRayPoints} />

                <ObjectManager
                  options={{
                    clusterize: true,
                    gridSize: 32,
                    clusterDisableClickZoom: true,
                  }}
                  objects={{
                    openBalloonOnClick: true,
                  }}
                  clusters={{
                    clusterIcons: [
                      {
                        href: svgIcon,
                        size: [20, 20],
                        offset: [-10, -10],
                      },
                    ],
                  }}
                  features={displayedPoints.map(
                    (point): ObjectManagerFeature => {
                      const objectType = objectTypes.find(
                        (type) => type.identifier === point.objectType
                      );

                      const color = objectType?.color || "#000";

                      return {
                        ...point,
                        type: "Feature",
                        geometry: {
                          type: "Point",
                          coordinates: point.geometry.coordinates,
                        },
                        options: {
                          iconColor: color,
                        },
                      };
                    }
                  )}
                  modules={[
                    "objectManager.addon.objectsBalloon",
                    "objectManager.addon.objectsHint",
                  ]}
                  instanceRef={(ref: any) => {
                    if (ref) {
                      objectManagerRef.current = ref;
                      ref.objects.options.set("preset", "islands#greenDotIcon");
                      ref.objects.events.add("click", (e: any) => {
                        const objectId = e.get("objectId");
                        const point = points.find((p) => p.id === objectId);
                        if (point) {
                          // Дополнительные действия при клике на точку, если необходимо
                        }
                      });
                      ref.events.add("balloonopen", () => {
                        document.addEventListener("click", handleBalloonEvent);
                      });
                      ref.events.add("balloonclose", () => {
                        document.removeEventListener(
                          "click",
                          handleBalloonEvent
                        );
                      });
                    }
                  }}
                />
                <Objects points={displayedPoints} />
                <ZoomControl options={{ float: "left" }} />
              </Map>
            </div>
          </YMaps>
        )}
        <Modal
          isOpen={isOpenEditPoint}
          onClose={() => setIsOpenEditPoint(false)}
        >
          <Editor
            onSubmit={onSubmitEditor}
            onClose={handleCloseModal}
            initialData={editingPoint}
          />
        </Modal>
      </div>
    </div>
  );
};
