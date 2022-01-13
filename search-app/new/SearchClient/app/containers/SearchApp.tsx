import * as React from 'react';
import { observer } from 'mobx-react'
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import { SearchResultStore } from '../store/SearchResultStore';
import { AppState } from '../store/AppState';

interface ISearchAppProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class SearchApp extends React.Component<ISearchAppProps, {}> {

  componentDidMount() {
    if (this.props.searchResultStore.loadInitialWhatever) {
      this.props.searchResultStore.loadInitialWhatever();
    }
  }

  render() {
    const { appState, searchResultStore } = this.props;

    return (
      <div>
        <Header searchResultStore={searchResultStore} />
        <MainSection appState={appState} searchResultStore={searchResultStore} />
      </div>
    );
  }
}