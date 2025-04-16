export const safeColorConversion = (color: string | undefined): string => {
  if (!color) {
    return "rgb(0, 0, 0)";
  }

  if (color.startsWith("rgb")) {
    return color;
  }

  const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);

  if (isHex) {
    try {
      return hexToRgb(color);
    } catch (e) {
      console.warn("Ошибка при конвертации HEX в RGB:", e);
      return "rgb(0, 0, 0)";
    }
  }

  return "rgb(0, 0, 0)";
};

export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(rgb: string): string {
  const matches = rgb.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!matches) {
    return "#000000";
  }

  const r = parseInt(matches[1]);
  const g = parseInt(matches[2]);
  const b = parseInt(matches[3]);

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
