import {SearchResultItemModel} from "./SearchResultItemModel";
import {TranscriptPartGroupModel} from "./TranscriptPartGroupModel";
import {observable} from "mobx";

export class SearchResultModel {
  @observable
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