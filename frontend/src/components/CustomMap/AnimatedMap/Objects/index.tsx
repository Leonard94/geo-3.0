import { MovingObject } from "./MovingObject/MovingObject";
import { useMemo } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { EntityType } from "../../../../DATA";
import { selectItems } from "../../../EntityManager/EntityManager";
import { IPoint } from "../../../../pages/MapPage/CustomMap/types";

type Props = {
  points: IPoint[];
};

export const Objects = ({ points }: Props) => {
  const { items } = useAppSelector(selectItems[EntityType.INCIDENTS]);
  const incidentTypes = useAppSelector((state) => state.incidentTypes.items);

  const movingObjects = useMemo(() => {
    // Map through the array of items to transform each into the desired format
    const mappedInstances = items
      .filter((i) => i.type !== "OBSTREL")
      .map((i) => {
        const coordinates = JSON.parse(String(i.coordinates));

        const incidentType = incidentTypes.find(
          (type) => type.identifier === i.type
        ); // Было type.name === i.type
        const color = incidentType?.color || "#000";

        // Construct the item object in the desired format
        const item = {
          id: i.id,
          trajectory: coordinates.map(
            (point: { latitude: number; longitude: number }) => {
              return [
                parseFloat(point.latitude.toString()),
                parseFloat(point.longitude.toString()),
              ];
            }
          ),
          color: color,
          speed: i.speed || 120,
          distance: i.distance || 500000,
          title: i.title,
          incidentType: i.type,
        };

        // Return the transformed object
        return item;
      });

    // Return the transformed list of moving objects
    return mappedInstances;
  }, [items, incidentTypes]);

  return (
    <>
      {movingObjects.map((object) => (
        <MovingObject
          points={points}
          key={object.id}
          id={object.id}
          trajectory={object.trajectory}
          color={String(object.color)}
          speed={+object.speed}
          distance={+object.distance}
          title={String(object.title)}
          incidentType={String(object.incidentType)}
        />
      ))}
    </>
  );
};
