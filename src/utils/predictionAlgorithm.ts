type Angle = number;
type Direction = "clockwise" | "counterclockwise" | "collinear";

interface ShiftResult {
  newA: Angle;
  newB: Angle;
  newC: Angle;
}

interface MidpointResult {
  midpointClockwise: Angle;
  midpointCounterclockwise: Angle;
}

interface FinalMidpointResult {
  finalMidpointClockwise: Angle;
  finalMidpointCounterclockwise: Angle;
}

interface SectorResult {
  sector: Direction;
  start: Angle;
  end: Angle;
  angle: Angle;
}

const inputToAngleMapping: Record<number, Angle> = {
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

function convertUserInputToAngle(input: number): Angle {
  return inputToAngleMapping[input] ?? input;
}

function calculateOrientation(A: Angle, B: Angle, C: Angle): Direction {
  const xA = Math.cos((A * Math.PI) / 180);
  const xB = Math.cos((B * Math.PI) / 180);
  const xC = Math.cos((C * Math.PI) / 180);
  const yA = Math.sin((A * Math.PI) / 180);
  const yB = Math.sin((B * Math.PI) / 180);
  const yC = Math.sin((C * Math.PI) / 180);

  const orientationValue = (xB - xA) * (yC - yA) - (xC - xA) * (yB - yA);

  if (orientationValue > 0) return "counterclockwise";
  if (orientationValue < 0) return "clockwise";
  return "collinear";
}

function normalizeAngle(angle: Angle): Angle {
  return (angle + 360) % 360;
}

function calculateShift(A: Angle, B: Angle, C: Angle): ShiftResult {
  const orientation = calculateOrientation(A, B, C);
  const shift = normalizeAngle(A - C);

  if (orientation === "counterclockwise") {
    const newA = normalizeAngle(A + shift);
    const newB = normalizeAngle(B + shift);
    const newC = normalizeAngle(C + shift);
    return { newA, newB, newC };
  }

  return { newA: A, newB: B, newC: C };
}

function calculateMidpointAngle(A: Angle, B: Angle): MidpointResult {
  A = normalizeAngle(A);
  B = normalizeAngle(B);

  let clockwiseDiff = A - B;
  let counterclockwiseDiff = B - A;

  if (clockwiseDiff < 0) clockwiseDiff += 360;
  if (counterclockwiseDiff < 0) counterclockwiseDiff += 360;

  const midpointClockwise = (B + clockwiseDiff / 2) % 360;
  const midpointCounterclockwise = (A + counterclockwiseDiff / 2) % 360;

  return { midpointClockwise, midpointCounterclockwise };
}

function calculateFinalMidpoint(midpoint: Angle, C: Angle): FinalMidpointResult {
  const angle1 = normalizeAngle(midpoint);
  const angle2 = normalizeAngle(C);

  let clockwiseDiff = angle1 - angle2;
  let counterclockwiseDiff = angle2 - angle1;

  if (clockwiseDiff < 0) clockwiseDiff += 360;
  if (counterclockwiseDiff < 0) counterclockwiseDiff += 360;

  const finalMidpointClockwise = (angle2 + clockwiseDiff / 2) % 360;
  const finalMidpointCounterclockwise = (angle1 + counterclockwiseDiff / 2) % 360;

  return { finalMidpointClockwise, finalMidpointCounterclockwise };
}

function calculateSmallestSector(start: Angle, end: Angle): SectorResult {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  let clockwiseDist = end - start;
  if (clockwiseDist < 0) clockwiseDist += 360;

  let counterclockwiseDist = start - end;
  if (counterclockwiseDist < 0) counterclockwiseDist += 360;

  if (clockwiseDist <= counterclockwiseDist) {
    return { sector: "clockwise", start, end, angle: clockwiseDist };
  }
  return { sector: "counterclockwise", start: end, end: start, angle: counterclockwiseDist };
}

function roundUpToNextTens(angle: Angle): Angle {
  return Math.ceil(angle / 10) * 10;
}

function generateLuckyAngles(angle: Angle, direction: Direction): Angle[] {
  const angles: Angle[] = [];
  const step = direction === "clockwise" ? 10 : -10;
  for (let i = -5; i <= 6; i++) {
    angles.push(normalizeAngle(angle + i * step));
  }
  return angles;
}

function mapAnglesToLuckyValues(angles: Angle[]): (number | null)[] {
  return angles.map(angle => angleToLuckyValueMapping[angle] ?? null);
}

function calculateSectorForOdds(firstOdd: number, secondOdd: number, thirdOdd: number): string {
  const a = Math.round(firstOdd * 10);
  const b = Math.round(secondOdd * 10);
  const c = Math.round(thirdOdd * 10);

  let A = convertUserInputToAngle(a);
  let B = convertUserInputToAngle(b);
  let C = convertUserInputToAngle(c);

  const orientation = calculateOrientation(A, B, C);

  if (orientation === "counterclockwise") {
    ({ newA: A, newB: B, newC: C } = calculateShift(A, B, C));
  }

  const midpoints = calculateMidpointAngle(A, B);
  const chosenMidpoint = orientation === "counterclockwise"
    ? midpoints.midpointCounterclockwise
    : midpoints.midpointClockwise;

  const finalMidpoints = calculateFinalMidpoint(chosenMidpoint, C);

  const luckyClockwise = roundUpToNextTens(finalMidpoints.finalMidpointClockwise);
  const luckyCounterclockwise = roundUpToNextTens(finalMidpoints.finalMidpointCounterclockwise);

  const luckyClockwiseAngles = generateLuckyAngles(luckyClockwise, "clockwise");
  const luckyCounterclockwiseAngles = generateLuckyAngles(luckyCounterclockwise, "counterclockwise");

  const mappedLuckyClockwise = mapAnglesToLuckyValues(luckyClockwiseAngles);
  const mappedLuckyCounterclockwise = mapAnglesToLuckyValues(luckyCounterclockwiseAngles);

  const smallestSector = calculateSmallestSector(C, chosenMidpoint);

  return `${smallestSector.sector} from ${smallestSector.start}° to ${smallestSector.end}° with angle ${smallestSector.angle}°`;
}

export function calculateLuckySector(homeOdds: number, drawOdds: number, awayOdds: number): { sector1: string; sector2: string } {
  const sector1 = calculateSectorForOdds(homeOdds, drawOdds, awayOdds);
  const sector2 = calculateSectorForOdds(awayOdds, drawOdds, homeOdds);

  return { sector1, sector2 };
}
