export interface IPolygon {
  id: string
  coordinates: number[][]
}

export interface IPoint {
  type: 'Feature';
  objectType?: string;
  id: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    balloonContent?: string
    clusterCaption?: string
    hintContent?: string
    balloonContentHeader?: string
    balloonContentBody?: string
    balloonContentFooter?: string
  }
  title: string
  address: string
  comment: string
  validity: boolean;
}

export interface IPlaceMarkPointProps {
  locations: IPoint[]
  selectedLocation: IPoint | null
  setSelectedLocation: (location: IPoint | null) => void
  updatePoint: (id: string, lat: number, lon: number) => void
  editingPoint: IPoint | null
  setEditingPoint: (point: IPoint | null) => void
  deletePoint: (id: string) => void
  onEdit: (point: IPoint) => void
}

export enum EDrawingMode {
  POINT = 'point',
  POLYGON = 'polygon',
}
