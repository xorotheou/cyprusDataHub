export interface OpenDataCategory {
  id: string;
  name: string;
  greekName: string;
  description: string;
  iconName: string;
  badge: string;
  datasetCount: number;
  featuredApi: string;
  featuredApiEndpoint?: string;
  apiType: 'REST' | 'CKAN' | 'Real-Time Feed' | 'GeoJSON / WMS';
  searchQuery: string;
  keyMetrics: { label: string; value: string }[];
  sampleDatasets: {
    title: string;
    source: string;
    format: string;
    updateFrequency: string;
    description?: string;
    endpointUrl?: string;
  }[];
}

export interface DatasetDistribution {
  id?: string;
  title?: string;
  accessUrl: string;
  downloadUrl?: string;
  format?: string;
  mediaType?: string;
}

export interface CyprusDatasetItem {
  id: string;
  title: string;
  greekTitle?: string;
  description: string;
  greekDescription?: string;
  publisher: string;
  modified: string;
  issued?: string;
  formats: string[];
  portalUrl: string;
  cyprusPortalUrl: string;
  distributions?: DatasetDistribution[];
  contactPoint?: {
    name?: string;
    email?: string;
  };
  qualityScoring?: number;
  catalogId?: string;
  rawItem?: unknown;
}

export interface DatasetSearchResponse {
  totalCount: number;
  datasets: CyprusDatasetItem[];
  publishers: string[];
  page: number;
  pageSize: number;
  totalPages: number;
}
