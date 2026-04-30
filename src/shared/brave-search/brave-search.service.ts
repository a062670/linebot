import { Injectable, Logger } from '@nestjs/common';
import {
  WebSearchResult,
  ImageSearchResult,
} from './brave-search.interface';

const BRAVE_API_BASE = 'https://api.search.brave.com/res/v1';

const LOCALE_PARAMS = {
  country: 'TW',
};

@Injectable()
export class BraveSearchService {
  private readonly logger = new Logger(BraveSearchService.name);

  private get headers() {
    return {
      Accept: 'application/json',
      'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
    };
  }

  private buildUrl(path: string, params: Record<string, string>) {
    const qs = new URLSearchParams({ ...LOCALE_PARAMS, ...params });
    return `${BRAVE_API_BASE}${path}?${qs.toString()}`;
  }

  async searchWeb(keyword: string): Promise<WebSearchResult[]> {
    const url = this.buildUrl('/web/search', { q: keyword });
    const resp = await fetch(url, { headers: this.headers });

    if (!resp.ok) {
      this.logger.error(
        `Brave web search failed (${resp.status}): ${await resp.text()}`,
      );
      return [];
    }

    const json = await resp.json();
    const results = json?.web?.results ?? [];
    return results.map((item: any) => ({
      title: item.title,
      snippet: item.description,
      link: item.url,
    }));
  }

  async searchImage(
    keyword: string,
    count = 10,
  ): Promise<ImageSearchResult[]> {
    const url = this.buildUrl('/images/search', {
      q: keyword,
      count: String(count),
    });
    const resp = await fetch(url, { headers: this.headers });

    if (!resp.ok) {
      this.logger.error(
        `Brave image search failed (${resp.status}): ${await resp.text()}`,
      );
      return [];
    }

    const json = await resp.json();
    const results = json?.results ?? [];
    return results
      .map((item: any) => ({
        imageUrl: item?.properties?.url ?? item?.thumbnail?.src,
      }))
      .filter((r: ImageSearchResult) => !!r.imageUrl);
  }
}

export { WebSearchResult, ImageSearchResult };
