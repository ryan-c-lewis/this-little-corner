import * as React from 'react';
import { observer } from 'mobx-react'
import MainSection from '../components/MainSection';
import { SearchResultStore } from '../store/SearchResultStore';
import { AppState } from '../store/AppState';

interface ISearchAppProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class SearchApp extends React.Component<ISearchAppProps, {}> {

  render() {
    const { appState, searchResultStore } = this.props;

    this.props.searchResultStore.init()

    return (
      <div>
        <MainSection appState={appState} searchResultStore={searchResultStore} />
      </div>
    );
  }
}