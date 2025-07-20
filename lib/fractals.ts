import { ArtParameters } from './types';
import { colorPalettes, PaletteKey } from './constants';

export function drawMandelbrotFractal(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const centerX = -0.5 + Math.sin(time * 0.001) * 0.1;
  const centerY = 0 + Math.cos(time * 0.001) * 0.1;
  const zoom = (4 / Math.min(width, height)) * (1 + Math.sin(time * 0.002) * 0.2);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const a = (x - width / 2) * zoom + centerX;
      const b = (y - height / 2) * zoom + centerY;

      let ca = a;
      let cb = b;
      let n = 0;

      while (n < fractalIterations) {
        const aa = ca * ca - cb * cb;
        const bb = 2 * ca * cb;

        ca = aa + a;
        cb = bb + b;

        if (ca * ca + cb * cb > 16) break;
        n++;
      }

      const colorIndex = Math.floor((n / fractalIterations) * colors.length);
      const color = colors[colorIndex % colors.length];
      const rgb = parseInt(color.slice(1), 16);

      const pixelIndex = (y * width + x) * 4;
      data[pixelIndex] = (rgb >> 16) & 255;
      data[pixelIndex + 1] = (rgb >> 8) & 255;
      data[pixelIndex + 2] = rgb & 255;
      data[pixelIndex + 3] = Math.floor(255 * opacity);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function drawJuliaFractal(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const ca = Math.sin(time * 0.001) * 0.8;
  const cb = Math.cos(time * 0.001) * 0.8;
  const zoom = 4 / Math.min(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = (x - width / 2) * zoom;
      let b = (y - height / 2) * zoom;
      let n = 0;

      while (n < fractalIterations) {
        const aa = a * a - b * b;
        const bb = 2 * a * b;

        a = aa + ca;
        b = bb + cb;

        if (a * a + b * b > 16) break;
        n++;
      }

      const colorIndex = Math.floor((n / fractalIterations) * colors.length);
      const color = colors[colorIndex % colors.length];
      const rgb = parseInt(color.slice(1), 16);

      const pixelIndex = (y * width + x) * 4;
      data[pixelIndex] = (rgb >> 16) & 255;
      data[pixelIndex + 1] = (rgb >> 8) & 255;
      data[pixelIndex + 2] = rgb & 255;
      data[pixelIndex + 3] = Math.floor(255 * opacity);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function drawSierpinskiTriangle(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;

  const drawTriangle = (x: number, y: number, size: number, depth: number) => {
    if (depth >= fractalIterations || size < 2) return;

    ctx.globalAlpha = opacity * (1 - depth / fractalIterations);
    ctx.fillStyle = colors[depth % colors.length];

    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.closePath();
    ctx.fill();

    const newSize = size / 2;
    drawTriangle(x, y - size / 4, newSize, depth + 1);
    drawTriangle(x - size / 4, y + size / 4, newSize, depth + 1);
    drawTriangle(x + size / 4, y + size / 4, newSize, depth + 1);
  };

  const size = Math.min(width, height) * 0.6;
  const centerX = width / 2;
  const centerY = height / 2 + size / 4;

  drawTriangle(centerX, centerY, size, 0);
}

export function drawKochSnowflake(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;

  const kochCurve = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
    if (depth === 0) {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = colors[depth % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const x3 = x1 + dx / 3;
    const y3 = y1 + dy / 3;
    const x4 = x1 + (2 * dx) / 3;
    const y4 = y1 + (2 * dy) / 3;

    const angle = Math.atan2(dy, dx) - Math.PI / 3;
    const length = Math.sqrt(dx * dx + dy * dy) / 3;
    const x5 = x3 + Math.cos(angle) * length;
    const y5 = y3 + Math.sin(angle) * length;

    kochCurve(x1, y1, x3, y3, depth - 1);
    kochCurve(x3, y3, x5, y5, depth - 1);
    kochCurve(x5, y5, x4, y4, depth - 1);
    kochCurve(x4, y4, x2, y2, depth - 1);
  };

  const size = Math.min(width, height) * 0.3;
  const centerX = width / 2;
  const centerY = height / 2;

  const angle = (time * 0.001) % (Math.PI * 2);
  for (let i = 0; i < 3; i++) {
    const sideAngle = angle + (i * Math.PI * 2) / 3;
    const x1 = centerX + Math.cos(sideAngle) * size;
    const y1 = centerY + Math.sin(sideAngle) * size;
    const x2 = centerX + Math.cos(sideAngle + (Math.PI * 2) / 3) * size;
    const y2 = centerY + Math.sin(sideAngle + (Math.PI * 2) / 3) * size;
    kochCurve(x1, y1, x2, y2, Math.min(fractalIterations, 5));
  }
}

export function drawDragonCurve(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;

  const dragonCurve = (
    x: number,
    y: number,
    length: number,
    angle: number,
    depth: number,
    direction: number,
  ): { x: number; y: number } => {
    if (depth === 0) {
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      ctx.globalAlpha = opacity;
      ctx.strokeStyle = colors[depth % colors.length];
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      return { x: endX, y: endY };
    }

    const newLength = length / Math.sqrt(2);
    const newAngle1 = angle - (Math.PI / 4) * direction;
    const newAngle2 = angle + (Math.PI / 4) * direction;

    const mid = dragonCurve(x, y, newLength, newAngle1, depth - 1, 1);
    return dragonCurve(mid.x, mid.y, newLength, newAngle2, depth - 1, -1);
  };

  const size = Math.min(width, height) * 0.3;
  const centerX = width / 2 - size / 2;
  const centerY = height / 2;
  const angle = (time * 0.001) % (Math.PI * 2);

  dragonCurve(centerX, centerY, size, angle, Math.min(fractalIterations, 12), 1);
}

export function drawMandalFractal(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { fractalIterations, opacity } = parameters;
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.4;

  const mandalaColors = [
    '#00FFFF',
    '#00FF00',
    '#FF0000',
    '#FFFF00',
    '#FF00FF',
    '#0080FF',
    '#FF8000',
    '#8000FF',
  ];

  const drawMandalaPoint = (angle: number, radius: number, depth: number) => {
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    const wave = Math.sin(time * 0.002 + angle * 8) * 0.1;
    const waveRadius = radius * (1 + wave);

    const finalX = centerX + Math.cos(angle) * waveRadius;
    const finalY = centerY + Math.sin(angle) * waveRadius;

    if (depth === 0) {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = mandalaColors[0];
      ctx.shadowColor = mandalaColors[0];
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(finalX, finalY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = opacity * 0.8;
      ctx.fillStyle = mandalaColors[2];
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(finalX, finalY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = opacity;
      ctx.fillStyle = mandalaColors[3];
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(finalX, finalY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const colorIndex = (depth + Math.floor(time * 0.01)) % mandalaColors.length;
      ctx.strokeStyle = mandalaColors[colorIndex];
      ctx.lineWidth = 2 + depth * 0.5;
      ctx.globalAlpha = opacity * (1 - depth / fractalIterations);
      ctx.shadowColor = mandalaColors[colorIndex];
      ctx.shadowBlur = 5 + depth * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }
  };

  const numPoints = 8;
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2 + time * 0.001;
    const radius = maxRadius * 0.3;

    drawMandalaPoint(angle, radius, 0);

    for (let depth = 1; depth < Math.min(fractalIterations, 6); depth++) {
      const subRadius = radius * (0.5 + depth * 0.2);
      const subAngle = angle + Math.sin(time * 0.003 + depth) * 0.5;
      drawMandalaPoint(subAngle, subRadius, depth);
    }
  }

  for (let ring = 1; ring <= 4; ring++) {
    const ringRadius = maxRadius * (0.1 + ring * 0.15);
    const pointsInRing = numPoints * (ring + 1);

    for (let i = 0; i < pointsInRing; i++) {
      const angle = (i / pointsInRing) * Math.PI * 2 + time * 0.002;
      const radius = ringRadius + Math.sin(time * 0.001 + i) * 10;

      const colorIndex = (i + ring) % mandalaColors.length;
      ctx.strokeStyle = mandalaColors[colorIndex];
      ctx.lineWidth = 1 + ring * 0.5;
      ctx.globalAlpha = opacity * (0.8 - ring * 0.1);
      ctx.shadowColor = mandalaColors[colorIndex];
      ctx.shadowBlur = 3 + ring;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 2 + ring, 0, Math.PI * 2);
      ctx.stroke();

      if (i > 0) {
        const prevAngle = ((i - 1) / pointsInRing) * Math.PI * 2 + time * 0.002;
        const prevRadius = ringRadius + Math.sin(time * 0.001 + i - 1) * 10;
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }

  ctx.shadowBlur = 0;
}

export function drawFractal(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  switch (parameters.fractalType) {
    case 'mandelbrot':
      drawMandelbrotFractal(ctx, time, parameters);
      break;
    case 'julia':
      drawJuliaFractal(ctx, time, parameters);
      break;
    case 'sierpinski':
      drawSierpinskiTriangle(ctx, time, parameters);
      break;
    case 'koch':
      drawKochSnowflake(ctx, time, parameters);
      break;
    case 'dragon':
      drawDragonCurve(ctx, time, parameters);
      break;
    case 'mandala':
      drawMandalFractal(ctx, time, parameters);
      break;
    default:
      drawMandelbrotFractal(ctx, time, parameters);
  }
}
