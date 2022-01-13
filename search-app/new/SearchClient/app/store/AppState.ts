import { observable, action, useStrict } from 'mobx';

useStrict(true);

export class AppState {

  constructor() {
    this.currentSearchFilter = SearchFilter.All;
  }

  @observable public currentSearchFilter: SearchFilter;

  @action
  setTodoFilter(filter: SearchFilter) {
    this.currentSearchFilter = filter;
  }

}

export enum SearchFilter {
  All,
  Active,
  Completed
}