import { EntityData, IBaseState } from "../types";

export interface RayDefinition {
  name?: string;
  distance: number;
  azimuth: number;
  openingAngle: number;
  visible?: boolean;
  color?: string;
}

export interface MainPointDefinition {
  name?: string; 
  id?: string;
  coordinates: [number, number];
  rayDefinitions: RayDefinition[];
  color?: string;
  active?: boolean;
  pointColor?: string;
  altitude?: string;
}

export interface ExtendedMainPointDefinition extends MainPointDefinition {
  active?: boolean;
  pointColor?: string;
  altitude?: string;
  rayDefinitions: Array<RayDefinition>;
}

export type TRabState = IBaseState<EntityData>
