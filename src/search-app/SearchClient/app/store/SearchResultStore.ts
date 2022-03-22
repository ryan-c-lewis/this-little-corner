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

  @observable isLoading: boolean = false;

  @action init(initialRequest: SearchRequestModel): Promise<any> {
    return this.search(initialRequest);
  }

  @action goToPage(page: number): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.lastRequest.query,
      sort: this.lastRequest.sort,
      channel: this.lastRequest.channel,
      page: page,
      pageSize: this.lastRequest.pageSize}));
  }

  @action changeQuery(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: newValue,
      sort: this.lastRequest.sort,
      channel: this.lastRequest.channel,
      page: 0,
      pageSize: this.lastRequest.pageSize}));
  }

  @action changeSort(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.lastRequest.query,
      sort: newValue,
      channel: this.lastRequest.channel,
      page: 0,
      pageSize: this.lastRequest.pageSize}));
  }

  @action changeChannel(newValue: string): Promise<any> {
    return this.search(new SearchRequestModel({
      query: this.lastRequest.query,
      sort: this.lastRequest.sort,
      channel: newValue,
      page: 0,
      pageSize: this.lastRequest.pageSize}));
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
          this.result = new SearchResultModel({items: items});
          
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