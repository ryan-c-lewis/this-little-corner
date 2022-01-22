import * as React from 'react';
import { observer } from 'mobx-react'
import SearchPage from '../components/SearchPage';
import { SearchResultStore } from '../store/SearchResultStore';
import { AppState } from '../store/AppState';
import {SearchRequestModel} from "../model/SearchRequestModel";
import MenuBar from "../components/MenuBar";

interface ISearchAppProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class SearchApp extends React.Component<ISearchAppProps, {}> {

  render() {
    const { appState, searchResultStore } = this.props;

    const query = new URLSearchParams(window.location.search);
    
    this.props.searchResultStore.init(new SearchRequestModel({
      sort: query.get('sort') ?? 'newer',
      query: query.get('q') ?? '',
      pageSize: parseInt(query.get('size') ?? '10'),
      page: parseInt(query.get('page') ?? '0')}));

    return (
      <div>
        <SearchPage appState={appState} searchResultStore={searchResultStore} />
      </div>
    );
  }
}