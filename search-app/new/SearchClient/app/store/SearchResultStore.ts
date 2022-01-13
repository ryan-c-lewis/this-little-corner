import { observable, action, computed } from 'mobx';
import { SearchResultModel } from '../model/SearchResultModel';
import { searchAPI } from '../apiclient';
import {SearchRequestModel} from "../model/SearchRequestModel";

export class SearchResultStore {

  @observable lastRequest: SearchRequestModel;
  
  @observable result: SearchResultModel;

  @observable isLoading: boolean = false;

  @action init() {
    // do whatever here I guess
  }

  @action newSearch(query: string): Promise<any> {
    return this.search(new SearchRequestModel({query: query}));
  }

  @action search(request: SearchRequestModel): Promise<any> {
    return searchAPI.search(request)
      .then(action((data: any) => {
        this.result = data;
        this.lastRequest = request;
      }));
  }
}