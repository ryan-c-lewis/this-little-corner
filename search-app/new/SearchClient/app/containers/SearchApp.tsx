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

  componentDidMount() {
    if (this.props.searchResultStore.init) {
      this.props.searchResultStore.init();
    }
  }

  render() {
    const { appState, searchResultStore } = this.props;

    return (
      <div>
        <MainSection appState={appState} searchResultStore={searchResultStore} />
      </div>
    );
  }
}