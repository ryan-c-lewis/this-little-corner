import * as React from 'react';
import {observer, Provider} from 'mobx-react';
import {AppState, PageTypes} from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';
import MenuBar from "../components/MenuBar";
import GlossaryPage from "./GlossaryPage";
import SearchPage from "./SearchPage";
import ContactPage from "./ContactPage";

interface IRootProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class Root extends React.Component<IRootProps, {}> {
  render() {
    const { appState, searchResultStore } = this.props;
    
    return (
      <Provider appState={appState} searchResultStore={searchResultStore}>
        <div>
          <MenuBar appState={appState}/>
          {this.props.appState.currentPageType === PageTypes.Contact
              ? <ContactPage appState={appState} searchResultStore={searchResultStore} /> : ""}
          {this.props.appState.currentPageType === PageTypes.Glossary
              ? <GlossaryPage appState={appState} /> : ""}
          {this.props.appState.currentPageType === PageTypes.Search
              ? <SearchPage appState={appState} searchResultStore={searchResultStore} /> : ""}
        </div>
      </Provider>
    );
  }
}