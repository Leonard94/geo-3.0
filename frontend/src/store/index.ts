import { configureStore } from "@reduxjs/toolkit";
import employeesSlice from "./employees/employeesSlice";
import objectsSlice from "./objects/objectsSlice";
import incidentsSlice from "./incidents/incidentsSlice";
import customObjectTypesSlice from "./customObjectTypes/customObjectTypesSlice";
import customIncidentTypesSlice from "./customIncidentsTypes/customIncidentsTypesSlice";
import rabSlice from "./rab/rabSlice";

export const store = configureStore({
  reducer: {
    employees: employeesSlice,
    objects: objectsSlice,
    incidents: incidentsSlice,
    objectTypes: customObjectTypesSlice,
    incidentTypes: customIncidentTypesSlice,
    rab: rabSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
