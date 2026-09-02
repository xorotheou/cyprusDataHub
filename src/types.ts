export interface OpenDataCategory {
  id: string;
  name: string;
  greekName: string;
  description: string;
  iconName: string;
  badge: string;
  datasetCount: number;
  featuredApi: string;
  apiType: 'REST' | 'CKAN' | 'Real-Time Feed' | 'GeoJSON / WMS';
  keyMetrics: { label: string; value: string }[];
  sampleDatasets: {
    title: string;
    source: string;
    format: string;
    updateFrequency: string;
  }[];
}
