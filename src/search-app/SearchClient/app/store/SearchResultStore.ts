import {observable, action, computed, ObservableMap, IObservableArray} from 'mobx';
import { SearchResultModel } from '../model/SearchResultModel';
import { searchAPI } from '../apiclient';
import {SearchRequestModel} from "../model/SearchRequestModel";
import {SearchResultItemModel} from "../model/SearchResultItemModel";
import {TranscriptPartGroupModel} from "../model/TranscriptPartGroupModel";
import {ObservableArray} from "mobx/lib/types/observablearray";

export class SearchResultStore {

  @observable lastRequest: SearchRequestModel;
  
  @observable result: SearchResultModel;

  @action init(initialRequest: SearchRequestModel): Promise<any> {
    return this.search(initialRequest);
  }
  
  searchHasHappened() {
    return this.lastRequest !== undefined;
  }

  getLastQuery() {
    return this.lastRequest?.query ?? '';
  }
  getLastSort() {
    return this.lastRequest?.sort ?? 'relevant';
  }
  getLastChannel() {
    return this.lastRequest?.channel ?? 'all';
  }
  getLastPage() {
    return this.lastRequest?.page ?? 0;
  }
  getLastPageSize() {
    return this.lastRequest?.pageSize ?? 10;
  }

  @action goToPage(page: number): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.getLastQuery(),
      sort: this.getLastSort(),
      channel: this.getLastChannel(),
      page: page,
      pageSize: this.getLastPageSize()}));
  }

  @action changeQuery(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: newValue,
      sort: this.getLastSort(),
      channel: this.getLastChannel(),
      page: 0,
      pageSize: this.getLastPageSize()}));
  }

  @action changeSort(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.getLastQuery(),
      sort: newValue,
      channel: this.getLastChannel(),
      page: 0,
      pageSize: this.getLastPageSize()}));
  }

  @action changeChannel(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.getLastQuery(),
      sort: this.getLastSort(),
      channel: newValue,
      page: 0,
      pageSize: this.getLastPageSize()}));
  }

  @action search(request: SearchRequestModel): Promise<any> {
    return searchAPI.search(request)
      .then(action((data: SearchResultModel) => {
        this.result = data;
        this.lastRequest = request;
      }));
  }
  
  @action seeFullTranscript(video_id: string) {
    searchAPI.getFullTranscript(video_id)
        .then(action((data: SearchResultItemModel) => {
          
          let items = this.result.items.map(x => x.video_id === video_id ? data : x);
          this.result = new SearchResultModel({
            items: items,
            totalResults: this.result.totalResults,
            totalPages: this.result.totalPages,
            currentPage: this.result.currentPage,
          });
          
          // TODO: i can't figure out how to make just the transcriptData update properly. But that would be better, because updating the whole result forces the video to reload.
          // this.result.items.map(x => {
          //   if (x.video_id === video_id) {
          //     x.transcriptData = data.transcriptData;
          //   }
          // });
        }));
  }

  submitContactForm(address: string, body: string) {
    searchAPI.submitContactForm(address, body);
  }
}