export interface CarRange {
  min: number;
  max: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  country: string;
  basePrice: number;
  range: CarRange;
  features: string[];
}
