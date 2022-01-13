import {SearchResultItemModel} from "./SearchResultItemModel";

export class SearchResultModel {
  items: SearchResultItemModel[];
  total: number;
  totalPages: number;
  currentPage: number;

  public constructor(init?:Partial<SearchResultModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      items: this.items,
      total: this.total,
      totalPages: this.totalPages,
      currentPage: this.currentPage
    }
  }
}