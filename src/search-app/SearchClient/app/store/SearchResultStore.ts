import { observable, action, computed } from 'mobx';
import { SearchResultModel } from '../model/SearchResultModel';
import { searchAPI } from '../apiclient';
import {SearchRequestModel} from "../model/SearchRequestModel";
import {TranscriptPartGroupModel} from "../model/TranscriptPartGroupModel";
import {TranscriptPartModel} from "../model/TranscriptPartModel";

export class SearchResultStore {

  @observable lastRequest: SearchRequestModel;
  
  @observable result: SearchResultModel;

  @observable isLoading: boolean = false;

  @action init(initialRequest: SearchRequestModel): Promise<any> {
    return this.search(initialRequest);
  }

  @action newSearch(query: string): Promise<any> {
    return this.search(new SearchRequestModel({query: query}));
  }

  @action goToPage(page: number): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.lastRequest.query,
      sort: this.lastRequest.sort,
      page: page,
      pageSize: this.lastRequest.pageSize}));
  }

  @action changeSort(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.lastRequest.query,
      sort: newValue,
      page: 0,
      pageSize: this.lastRequest.pageSize}));
  }

  @action search(request: SearchRequestModel): Promise<any> {
    return searchAPI.search(request)
      .then(action((data: any) => {
        this.result = data;
        this.lastRequest = request;
      }));
  }
  
  @action seeFullTranscript(video_id: string) {
    searchAPI.getFullTranscript(video_id)
        .then(action((data: any) => {
          this.result.items = this.result.items.map(x => x.video_id ? data : x);
        }));
  }
}