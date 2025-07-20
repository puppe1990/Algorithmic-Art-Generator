import { ArtParameters, AudioData } from './types';
import { colorPalettes, PaletteKey } from './constants';

export function drawCirclePattern(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
  audioData: AudioData,
) {
  const { volume, frequency } = audioData;
  const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const volumeFactor = parameters.audioReactive ? 1 + volume : 1;
  const colorOffset = parameters.audioReactive ? Math.floor(frequency * colors.length) : 0;
  const { width, height } = ctx.canvas;

  for (let i = 0; i < shapeCount; i++) {
    const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01;
    const radius = Math.min(width, height) * 0.3 * volumeFactor;
    const x = width / 2 + Math.cos(angle) * radius * (0.5 + Math.sin(time * rotationSpeed * 0.005 + i) * 0.3);
    const y = height / 2 + Math.sin(angle) * radius * (0.5 + Math.cos(time * rotationSpeed * 0.005 + i) * 0.3);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = colors[(i + colorOffset) % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, shapeSize * (0.5 + Math.sin(time * 0.01 + i) * 0.5) * volumeFactor, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawTrianglePattern(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
  audioData: AudioData,
) {
  const { volume, frequency } = audioData;
  const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const volumeFactor = parameters.audioReactive ? 1 + volume : 1;
  const colorOffset = parameters.audioReactive ? Math.floor(frequency * colors.length) : 0;
  const { width, height } = ctx.canvas;

  for (let i = 0; i < shapeCount; i++) {
    const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01;
    const radius = Math.min(width, height) * 0.25 * volumeFactor;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * rotationSpeed * 0.01);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = colors[(i + colorOffset) % colors.length];

    const size = shapeSize * (0.5 + Math.sin(time * 0.01 + i) * 0.5) * volumeFactor;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export function drawLinePattern(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
  audioData: AudioData,
) {
  const { volume, frequency } = audioData;
  const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const volumeFactor = parameters.audioReactive ? 1 + volume : 1;
  const colorOffset = parameters.audioReactive ? Math.floor(frequency * colors.length) : 0;
  const { width, height } = ctx.canvas;

  ctx.lineWidth = 3;
  for (let i = 0; i < shapeCount; i++) {
    const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01;
    const startRadius = 50 * volumeFactor;
    const endRadius = Math.min(width, height) * 0.4 * volumeFactor;

    const startX = width / 2 + Math.cos(angle) * startRadius;
    const startY = height / 2 + Math.sin(angle) * startRadius;
    const endX = width / 2 + Math.cos(angle + time * rotationSpeed * 0.005) * endRadius;
    const endY = height / 2 + Math.sin(angle + time * rotationSpeed * 0.005) * endRadius;

    ctx.globalAlpha = opacity;
    ctx.strokeStyle = colors[(i + colorOffset) % colors.length];
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

export function drawSpiral(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
  audioData: AudioData,
) {
  const { volume, frequency } = audioData;
  const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters;
  const colors = Array.isArray(parameters.colorPalette)
    ? parameters.colorPalette
    : colorPalettes[parameters.colorPalette as PaletteKey];
  const volumeFactor = parameters.audioReactive ? 1 + volume : 1;
  const colorOffset = parameters.audioReactive ? Math.floor(frequency * colors.length) : 0;
  const { width, height } = ctx.canvas;

  for (let i = 0; i < shapeCount; i++) {
    const t = (i / shapeCount) * complexity * Math.PI * 2 + time * animationSpeed * 0.01;
    const radius = (i / shapeCount) * Math.min(width, height) * 0.4 * volumeFactor;
    const x = width / 2 + Math.cos(t + time * rotationSpeed * 0.005) * radius;
    const y = height / 2 + Math.sin(t + time * rotationSpeed * 0.005) * radius;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = colors[(i + colorOffset) % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, shapeSize * (0.3 + Math.sin(time * 0.01 + i) * 0.2) * volumeFactor, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawStarPattern(
  ctx: CanvasRenderingContext2D,
  time: number,
  parameters: ArtParameters,
) {
  const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters;
  const colors = colorPalettes[parameters.colorPalette as PaletteKey];
  const { width, height } = ctx.canvas;

  const points = 5 + Math.floor(complexity);
  const step = Math.PI / points;

  for (let i = 0; i < shapeCount; i++) {
    const angle = (i / shapeCount) * Math.PI * 2 + time * animationSpeed * 0.01;
    const radius = Math.min(width, height) * 0.35;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * rotationSpeed * 0.01);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = colors[i % colors.length];

    const outer = shapeSize;
    const inner = shapeSize * 0.5;
    ctx.beginPath();
    for (let j = 0; j < points * 2; j++) {
      const r = j % 2 === 0 ? outer : inner;
      const a = j * step;
      if (j === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
