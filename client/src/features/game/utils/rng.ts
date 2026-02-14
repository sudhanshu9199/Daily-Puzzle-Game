export const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const createRNG = (seed: number) => (offset: number) => seededRandom(seed + offset);