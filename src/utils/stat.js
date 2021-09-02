import { getEventTimeDiff } from './common';

export const getColor = () => `hsl(${Math.floor(360 * Math.random())},
 ${Math.floor(50 + 20 * Math.random())}%,
  ${Math.floor(45 + 20 * Math.random())}%)`;

export const getLigthenColors = (colors) =>
  colors.map((color) => (
    color.slice(0, -4) + ((+color.slice(-4, -2) + 20)).toString() + color.slice(-2)),
  );

export const getPointTypes = (points) => [...new Set(points.map((point) => point.eventType))];

export const getCostByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.eventType === type)
        .reduce(
          (sum, point) => sum + point.basePrice, 0),
    )
    .sort((a, b) => b - a);

export const getCountByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.eventType === type).length,
    )
    .sort((a, b) => b - a);

export const getTravelTimeByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.eventType === type)
        .reduce((sum, point) => sum + getEventTimeDiff(point), 0),
    )
    .sort((a, b) => b - a);
