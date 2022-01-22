import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { AppState } from './store/AppState';
import { SearchResultStore } from './store/SearchResultStore';
import './style/eui_theme_light.css' //import '@elastic/eui/dist/eui_theme_light.css' // this isn't the version i want so i copy-pasta'd to mine for now
import './style/style.css'

const appState = new AppState();
const searchResultStore = new SearchResultStore();

const renderApp = () => {
  const App = require('./containers/App').default;

  ReactDOM.render(
    <AppContainer>
      <App appState={appState} searchResultStore={searchResultStore} />
    </AppContainer>,
    document.getElementById('root')
  );
};

if ((module as any).hot) {
  const reRenderApp = () => {
    renderApp();
  };

  (module as any).hot.accept('./containers/App', () => {
    setImmediate(() => {
      reRenderApp();
    });
  });
}

renderApp();
