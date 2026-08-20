import { Car } from './models/car.model';

export function carTotalPrice(
  car: Car,
  featurePricing: Record<string, number>,
  activeFeatures: Iterable<string> = car.features
): number {
  let price = car.basePrice;
  for (const feature of activeFeatures) {
    price += featurePricing[feature] ?? 0;
  }
  return price;
}

export function carFeatureLineItems(
  car: Car,
  featurePricing: Record<string, number>
): { name: string; price: number }[] {
  return car.features.map((name) => ({ name, price: featurePricing[name] ?? 0 }));
}
