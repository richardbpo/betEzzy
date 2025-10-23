const inputToAngleMapping: Record<number, number> = {
  0: 0, 4: 0, 14: 0, 360: 0, 40: 0, 50: 0,
  1: 45, 2: 45, 7: 45, 8: 45, 10: 45, 11: 45, 13: 45, 16: 45, 37: 45, 38: 45, 43: 45, 44: 45, 46: 45, 47: 45, 49: 45,
  19: 135, 22: 135, 25: 135, 26: 135, 29: 135, 31: 135, 34: 135, 35: 135,
  23: 180, 27: 180, 28: 180, 32: 180,
  18: 225, 20: 225, 21: 225, 24: 225, 30: 225, 33: 225, 36: 225,
  3: 315, 5: 315, 6: 315, 9: 315, 12: 315, 15: 315, 17: 315, 39: 315, 41: 315, 42: 315, 45: 315, 48: 315
};

const angleToLuckyValueMapping: Record<number, number> = {
  0: 0, 10: 26, 20: 3, 30: 35, 40: 12, 50: 28, 60: 7, 70: 29,
  80: 18, 90: 22, 100: 9, 110: 31, 120: 14, 130: 20, 140: 1,
  150: 33, 160: 16, 170: 24, 180: 5, 190: 10, 200: 23, 210: 8,
  220: 30, 230: 11, 240: 36, 250: 13, 260: 27, 270: 6, 280: 34,
  290: 17, 300: 25, 310: 2, 320: 21, 330: 4, 340: 19, 350: 15,
  360: 32
};

function convertUserInputToAngle(input: number): number {
  return inputToAngleMapping[input] ?? input;
}

function calculateOrientation(A: number, B: number, C: number): string {
  const xA = Math.cos(A * Math.PI / 180);
  const xB = Math.cos(B * Math.PI / 180);
  const xC = Math.cos(C * Math.PI / 180);
  const yA = Math.sin(A * Math.PI / 180);
  const yB = Math.sin(B * Math.PI / 180);
  const yC = Math.sin(C * Math.PI / 180);

  const orientationValue = (xB - xA) * (yC - yA) - (xC - xA) * (yB - yA);

  if (orientationValue > 0) {
    return "counterclockwise";
  } else if (orientationValue < 0) {
    return "clockwise";
  } else {
    return "collinear";
  }
}

function normalizeAngle(angle: number): number {
  return (angle + 360) % 360;
}

function calculateShift(A: number, B: number, C: number): { newA: number; newB: number; newC: number } {
  const orientation = calculateOrientation(A, B, C);
  const shift = normalizeAngle(A - C);

  if (orientation === "counterclockwise") {
    const newA = normalizeAngle(A + shift);
    const newB = normalizeAngle(B + shift);
    const newC = normalizeAngle(C + shift);
    return { newA, newB, newC };
  } else {
    return { newA: A, newB: B, newC: C };
  }
}

function calculateMidpointAngle(A: number, B: number): { midpointClockwise: number; midpointCounterclockwise: number } {
  A = normalizeAngle(A);
  B = normalizeAngle(B);

  let clockwiseDifference = A - B;
  let counterclockwiseDifference = B - A;

  if (clockwiseDifference < 0) clockwiseDifference += 360;
  if (counterclockwiseDifference < 0) counterclockwiseDifference += 360;

  let midpointClockwise = B + clockwiseDifference / 2;
  let midpointCounterclockwise = A + counterclockwiseDifference / 2;

  return {
    midpointClockwise: midpointClockwise % 360,
    midpointCounterclockwise: midpointCounterclockwise % 360
  };
}

function calculateFinalMidpoint(midpoint: number, C: number): { finalMidpointClockwise: number; finalMidpointCounterclockwise: number } {
  let angle1 = normalizeAngle(midpoint);
  let angle2 = normalizeAngle(C);

  let clockwiseDifference = angle1 - angle2;
  let counterclockwiseDifference = angle2 - angle1;

  if (clockwiseDifference < 0) clockwiseDifference += 360;
  if (counterclockwiseDifference < 0) counterclockwiseDifference += 360;

  let midpointClockwise = angle2 + clockwiseDifference / 2;
  let midpointCounterclockwise = angle1 + counterclockwiseDifference / 2;

  return {
    finalMidpointClockwise: midpointClockwise % 360,
    finalMidpointCounterclockwise: midpointCounterclockwise % 360
  };
}

function calculateSmallestSector(start: number, end: number): { sector: string; start: number; end: number; angle: number } {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  let clockwiseDistance = end - start;
  if (clockwiseDistance < 0) clockwiseDistance += 360;

  let counterclockwiseDistance = start - end;
  if (counterclockwiseDistance < 0) counterclockwiseDistance += 360;

  if (clockwiseDistance <= counterclockwiseDistance) {
    return {
      sector: "clockwise",
      start: start,
      end: end,
      angle: clockwiseDistance
    };
  } else {
    return {
      sector: "counterclockwise",
      start: end,
      end: start,
      angle: counterclockwiseDistance
    };
  }
}

function roundUpToNextTens(angle: number): number {
  return Math.ceil(angle / 10) * 10;
}

export function calculateLuckySector(homeOdds: number, drawOdds: number, awayOdds: number): string {
  const a = Math.round(homeOdds * 10);
  const b = Math.round(drawOdds * 10);
  const c = Math.round(awayOdds * 10);

  const A = convertUserInputToAngle(a);
  const B = convertUserInputToAngle(b);
  const C = convertUserInputToAngle(c);

  const orientation = calculateOrientation(A, B, C);
  let newA = A, newB = B, newC = C;

  if (orientation === "counterclockwise") {
    const shiftedAngles = calculateShift(A, B, C);
    newA = shiftedAngles.newA;
    newB = shiftedAngles.newB;
    newC = shiftedAngles.newC;
  }

  const midpoints = calculateMidpointAngle(newA, newB);
  const chosenMidpoint = orientation === "counterclockwise" ? midpoints.midpointCounterclockwise : midpoints.midpointClockwise;
  const finalMidpoints = calculateFinalMidpoint(chosenMidpoint, newC);

  const smallestSector = calculateSmallestSector(newC, chosenMidpoint);

  return `${smallestSector.sector} from ${smallestSector.start.toFixed(0)}° to ${smallestSector.end.toFixed(0)}° with angle ${smallestSector.angle.toFixed(0)}°`;
}
