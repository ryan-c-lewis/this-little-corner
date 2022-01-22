import * as React from 'react';
import {observer} from 'mobx-react';
import SearchApp from './SearchApp';
import {AppState, PageTypes} from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';
import MenuBar from "../components/MenuBar";
import GlossaryApp from "./GlossaryApp";

interface IPageContainerProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class PageContainer extends React.Component<IPageContainerProps, {}> {
  render() {
    const { appState, searchResultStore } = this.props;
    
    return (
      <div>
        <MenuBar appState={appState}/>
        {this.props.appState.currentPageType === PageTypes.Glossary ? <GlossaryApp appState={appState} /> : ""}
        {this.props.appState.currentPageType === PageTypes.Search   ? <SearchApp appState={appState} searchResultStore={searchResultStore} /> : ""}
      </div>
    );
  }
}