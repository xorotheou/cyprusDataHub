import { CyprusDatasetItem, DatasetSearchResponse } from '../types';
import { FALLBACK_DATASETS_BY_CATEGORY } from '../data/fallbackDatasets';

const BASE_API_URL = 'https://data.europa.eu/api/hub/search/search';

// In-memory cache for API requests to avoid re-fetching
const cache = new Map<string, DatasetSearchResponse>();

function extractLocalizedText(obj: any, preferredLang: string = 'en', fallbackLang: string = 'el'): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj[preferredLang]) return obj[preferredLang];
  if (obj[fallbackLang]) return obj[fallbackLang];
  const keys = Object.keys(obj);
  if (keys.length > 0) return obj[keys[0]];
  return '';
}

export async function fetchCyprusDatasets(params: {
  categoryQuery?: string;
  userQuery?: string;
  publisher?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  categoryId?: string;
}): Promise<DatasetSearchResponse> {
  const {
    categoryQuery = '',
    userQuery = '',
    publisher = '',
    sort = 'modified+desc',
    page = 0,
    pageSize = 20,
    categoryId = 'all',
  } = params;

  // Build full query
  const queryParts: string[] = [];
  if (categoryQuery.trim()) {
    queryParts.push(`(${categoryQuery.trim()})`);
  }
  if (userQuery.trim()) {
    queryParts.push(`(${userQuery.trim()})`);
  }
  const combinedQuery = queryParts.join(' AND ');

  const cacheKey = `${combinedQuery}_${publisher}_${sort}_${page}_${pageSize}_${categoryId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const url = new URL(BASE_API_URL);
    url.searchParams.set('filter', 'dataset');
    url.searchParams.set('facets', JSON.stringify({ country: ['cy'] }));
    url.searchParams.set('limit', String(pageSize));
    url.searchParams.set('page', String(page));

    if (combinedQuery) {
      url.searchParams.set('q', combinedQuery);
    }
    if (sort) {
      url.searchParams.set('sort', sort);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const totalCount = data.result?.count || 0;
    const rawResults = data.result?.results || [];

    // Extract publishers for filter facets
    const publisherFacet = data.result?.facets?.find(
      (f: any) => f.id === 'publisher' || f.title?.toLowerCase() === 'publisher'
    );
    const availablePublishers: string[] = publisherFacet?.items
      ? publisherFacet.items.map((i: any) => i.id)
      : [];

    const datasets: CyprusDatasetItem[] = rawResults.map((item: any) => {
      const enTitle = extractLocalizedText(item.title, 'en', 'el') || 'Untitled Dataset';
      const elTitle = extractLocalizedText(item.title, 'el', 'en');
      const enDesc = extractLocalizedText(item.description, 'en', 'el') || 'No description provided.';
      const elDesc = extractLocalizedText(item.description, 'el', 'en');
      const pubName = item.publisher?.name || 'Government of Cyprus';

      // Infer formats from title/description or default
      const formats: string[] = [];
      const titleLower = enTitle.toLowerCase() + ' ' + (item.id || '');
      if (titleLower.includes('inspire') || titleLower.includes('wms') || titleLower.includes('hydrograph')) {
        formats.push('GeoJSON', 'WMS');
      } else if (titleLower.includes('monthly') || titleLower.includes('annual') || titleLower.includes('quarterly')) {
        formats.push('CSV', 'XLS');
      } else if (titleLower.includes('transport') || titleLower.includes('bus')) {
        formats.push('GTFS', 'JSON');
      } else {
        formats.push('CSV', 'JSON');
      }

      return {
        id: item.id || String(Math.random()),
        title: enTitle,
        greekTitle: elTitle !== enTitle ? elTitle : undefined,
        description: enDesc,
        greekDescription: elDesc !== enDesc ? elDesc : undefined,
        publisher: pubName,
        modified: item.modified || item.catalog_record?.modified || new Date().toISOString(),
        issued: item.issued || item.catalog_record?.issued,
        formats: formats.length > 0 ? formats : ['CSV', 'JSON'],
        portalUrl: `https://data.europa.eu/data/datasets/${item.id}?locale=en`,
        cyprusPortalUrl: `https://www.data.gov.cy`,
        contactPoint: item.contact_point?.[0]
          ? {
              name: item.contact_point[0].name,
              email: item.contact_point[0].email,
            }
          : undefined,
        qualityScoring: item.quality_meas?.scoring,
        catalogId: item.catalog?.id || 'national-open-data-portal-cyprus',
        rawItem: item,
      };
    });

    // If client requested publisher filter, apply it
    let filteredDatasets = datasets;
    if (publisher) {
      filteredDatasets = datasets.filter((d) => d.publisher.toLowerCase().includes(publisher.toLowerCase()));
    }

    const response: DatasetSearchResponse = {
      totalCount,
      datasets: filteredDatasets,
      publishers: availablePublishers,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };

    cache.set(cacheKey, response);
    return response;
  } catch (err) {
    console.warn('Cyprus Open Data API request failed or timed out, falling back to cached datasets:', err);

    // Use rich category fallback datasets
    const fallbackList = FALLBACK_DATASETS_BY_CATEGORY[categoryId] || FALLBACK_DATASETS_BY_CATEGORY['all'] || [];
    let filtered = fallbackList;
    if (userQuery) {
      const q = userQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.publisher.toLowerCase().includes(q)
      );
    }
    if (publisher) {
      filtered = filtered.filter((d) => d.publisher.toLowerCase().includes(publisher.toLowerCase()));
    }

    const totalCount = filtered.length;
    const start = page * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return {
      totalCount,
      datasets: paged,
      publishers: Array.from(new Set(fallbackList.map((d) => d.publisher))),
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };
  }
}
