export interface WatermarkConfig {
  txt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  font: string;
  fontSize: number;
  alpha: number;
  angle: number;
}

export function watermarkConfig(config: Partial<WatermarkConfig>): string {
  const _config = Object.assign(
    {
      txt: 'WATERMARK',
      x: 20,
      y: 0,
      width: 260,
      height: 260,
      color: '#7F8085',
      font: 'PingFangSC-Semibold,PingFang SC',
      fontSize: 40,
      alpha: 0.15,
      angle: 40
    },
    config || {}
  );
  const { txt, x, y, width, height, color, font, fontSize, alpha, angle } =
    _config;
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px">
              <text x="${x}px" y="${y}px" dy="${fontSize}px"
                  text-anchor="start"
                  fill="${color}"
                  fill-opacity="${alpha}"
                  transform="rotate(${angle},${x} ${y})"
                  font-weight="500"
                  font-size="${fontSize}"
                  font-family="${font}"
                  >
                  ${txt}
              </text>
          </svg>`;
  return `data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(svgStr))
  )}`;
}
