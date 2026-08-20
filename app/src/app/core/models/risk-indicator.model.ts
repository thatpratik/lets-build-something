export interface RiskIndicator {
  recalls: {
    count: number;
    summary: string;
  };
  batteryDegradation: {
    estimatedRetentionAt100kKm: number;
    note: string;
  };
  resaleValue: {
    rating: 'Strong' | 'Average' | 'Weak';
    note: string;
  };
  reviewLinks: {
    title: string;
    url: string;
  }[];
}
