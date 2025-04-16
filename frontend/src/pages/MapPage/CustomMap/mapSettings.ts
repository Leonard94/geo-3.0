export const MAP_SETTINGS = {
  center: [50.595414, 36.587267], // [55.75, 37.57] - Москва
  zoom: 10,
};

export const mapSettings = {
  options: {
    suppressMapOpenBlock: true, // Убирает кнопку "Открыть в Яндекс.Картах"
  },
  state: {
    center: MAP_SETTINGS.center,
    zoom: MAP_SETTINGS.zoom,
    controls: [], // Убираем все кнопки с карты (слои, пробки и т.д.)
  },
};
