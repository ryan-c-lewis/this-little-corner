import {SearchResultItemModel} from "./SearchResultItemModel";
import {TranscriptPartGroupModel} from "./TranscriptPartGroupModel";

export class SearchResultModel {
  items: SearchResultItemModel[];
  totalResults: number;
  totalPages: number;
  currentPage: number;

  public constructor(init?:Partial<SearchResultModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      items: this.items,
      totalResults: this.totalResults,
      totalPages: this.totalPages,
      currentPage: this.currentPage
    }
  }
}