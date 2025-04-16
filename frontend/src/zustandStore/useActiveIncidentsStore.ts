import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ActiveIncident = Record<string, string[]>;
type ActiveRays = Record<string, string[]>;

type ActiveIncidentsStore = {
  activeIncidents: ActiveIncident;
  activeRays: ActiveRays;
  addActiveIncidents: (incidentId: string, relatedIds: string[]) => void;
  removeActiveIncidents: (incidentId: string, relatedIds: string[]) => void;
  clearActiveIncident: (incidentId: string) => void;
  addActiveRayDetection: (rayId: string, incidentId: string) => void;
  removeActiveRayDetection: (rayId: string, incidentId: string) => void;
  clearIncidentFromAllRays: (incidentId: string) => void;
  isRayActive: (rayId: string) => boolean;
};

const defaultData: Pick<
  ActiveIncidentsStore,
  "activeIncidents" | "activeRays"
> = {
  activeIncidents: {},
  activeRays: {},
};

export const useActiveIncidentsStore = create<ActiveIncidentsStore>()(
  devtools((set, get) => ({
    ...defaultData,
    addActiveIncidents: (incidentId, relatedIds) => {
      const { activeIncidents } = get();

      set({
        activeIncidents: {
          ...activeIncidents,
          [incidentId]: relatedIds,
        },
      });
    },
    removeActiveIncidents: (incidentId, relatedIds) => {
      const { activeIncidents } = get();
      const currentIds = activeIncidents[incidentId] || [];

      const updatedIds = currentIds.filter((id) => !relatedIds.includes(id));

      set({
        activeIncidents: {
          ...activeIncidents,
          ...(updatedIds.length > 0 ? { [incidentId]: updatedIds } : {}), // Remove key if no IDs remain
        },
      });
    },
    clearActiveIncident: (incidentId) => {
      const { activeIncidents } = get();
      const { [incidentId]: _, ...remainingIncidents } = activeIncidents; // Exclude the cleared key
      set({ activeIncidents: remainingIncidents });
    },

    addActiveRayDetection: (rayId, incidentId) => {
      const { activeRays } = get();
      const currentIncidents = activeRays[rayId] || [];

      if (!currentIncidents.includes(incidentId)) {
        set({
          activeRays: {
            ...activeRays,
            [rayId]: [...currentIncidents, incidentId],
          },
        });
      }
    },

    removeActiveRayDetection: (rayId, incidentId) => {
      const { activeRays } = get();
      const currentIncidents = activeRays[rayId] || [];

      const updatedIncidents = currentIncidents.filter(
        (id) => id !== incidentId
      );

      if (updatedIncidents.length === 0) {
        const { [rayId]: _, ...remainingRays } = activeRays;
        set({ activeRays: remainingRays });
      } else {
        set({
          activeRays: {
            ...activeRays,
            [rayId]: updatedIncidents,
          },
        });
      }
    },

    clearIncidentFromAllRays: (incidentId) => {
      const { activeRays } = get();
      const updatedRays: ActiveRays = {};

      Object.entries(activeRays).forEach(([rayId, incidentIds]) => {
        const filteredIds = incidentIds.filter((id) => id !== incidentId);
        if (filteredIds.length > 0) {
          updatedRays[rayId] = filteredIds;
        }
      });

      set({ activeRays: updatedRays });
    },

    isRayActive: (rayId) => {
      const { activeRays } = get();
      return !!activeRays[rayId] && activeRays[rayId].length > 0;
    },
  }))
);
