
/**
 * Utilities for generating random numbers from various distributions
 */

// Exponential distribution
export function generateExponential(mean: number): number {
  return -mean * Math.log(Math.random());
}

// Normal distribution using Box-Muller transform
export function generateNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + stdDev * z;
}

// Gamma distribution approximation using Marsaglia and Tsang method
export function generateGamma(shape: number, scale: number): number {
  // For shape < 1, use alpha = shape + 1 and apply transformation at the end
  let alpha = shape;
  let applyTransformation = false;
  
  if (shape < 1) {
    alpha = shape + 1;
    applyTransformation = true;
  }
  
  const d = alpha - 1/3;
  const c = 1 / Math.sqrt(9 * d);
  
  let x, v, u;
  do {
    do {
      x = generateNormal(0, 1);
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    u = Math.random();
  } while (
    u > 1 - 0.331 * Math.pow(x, 4) && 
    Math.log(u) > 0.5 * x * x + d * (1 - v + Math.log(v))
  );
  
  let result = d * v * scale;
  
  // Apply transformation if shape < 1
  if (applyTransformation) {
    const p = Math.pow(Math.random(), 1 / shape);
    result *= p;
  }
  
  return result;
}

// Uniform distribution
export function generateUniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Generate a random number based on the specified distribution
export function generateRandom(distribution: string, mean: number): number {
  switch (distribution) {
    case "Exponential":
      return generateExponential(mean);
    case "Normal":
      // For Normal, we use mean as both the mean and standard deviation
      return Math.max(0.001, generateNormal(mean, mean / 2));
    case "Gamma":
      // For Gamma, we use shape=2 and scale = mean/shape
      return generateGamma(2, mean / 2);
    case "Uniform":
      // For Uniform, we use [0, 2*mean] to get mean as the average
      return generateUniform(0, 2 * mean);
    default:
      return generateExponential(mean);
  }
}
