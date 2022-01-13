import * as React from 'react';
import { Provider } from 'mobx-react';
import SearchApp from './SearchApp';
import DevTools from 'mobx-react-devtools'
import { AppState } from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';

interface IRootProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

export default class Root extends React.Component<IRootProps, void> {
  render() {
    const { appState, searchResultStore } = this.props;
    return (
      <Provider appState={appState} searchResultStore={searchResultStore}>
        <div>
          <SearchApp appState={appState} searchResultStore={searchResultStore} />
          <DevTools />
        </div>
      </Provider>
    );
  }
}