import { observable, action, computed } from 'mobx';
import { SearchResultModel } from '../model/SearchResultModel';
import { todosApi } from '../apiclient';

export class SearchResultStore {

  @observable results: SearchResultModel[] = [];

  @observable isLoading: boolean = false;

  @action loadInitialWhatever(): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action search(query: string): Promise<any> {
    return todosApi.search(query)
      .then(action((data: any) => {
        this.results = data.map(x => new SearchResultModel(x));
      }));
  }

  @action editTodo(id: number, title: string): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action deleteTodo(id: number): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action toggleCompleted(id: number): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action markAllCompleted(): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action clearCompleted(): Promise<any> {
    return new Promise<any>(() => {});
  }
}