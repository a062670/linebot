import { Injectable } from '@nestjs/common';
import { GoogleSearchResult } from './google-search.interface';

@Injectable()
export class GoogleSearchService {
  async search(keyword: string) {
    const resp = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${keyword}&key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}`,
    );

    if (!resp.ok) {
      return [];
    }

    const json = await resp.json();

    return json.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    })) as GoogleSearchResult[];
  }
}
export { GoogleSearchResult };
