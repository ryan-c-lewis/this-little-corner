import * as React from 'react';
import {Provider} from 'mobx-react';
import {AppState} from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';
import PageContainer from "./PageContainer";

interface IRootProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

export default class Root extends React.Component<IRootProps, void> {
  render() {
    const { appState, searchResultStore } = this.props;
    
    return (
      <Provider appState={appState} searchResultStore={searchResultStore}>
        <PageContainer appState={appState} searchResultStore={searchResultStore} />
      </Provider>
    );
  }
}