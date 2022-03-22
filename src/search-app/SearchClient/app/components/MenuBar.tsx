import * as React from 'react';
import {AppState, PageTypes} from "../store/AppState";
import {observer} from "mobx-react";

interface IMenuBarProps {
  appState: AppState
}

interface IMenuBarState {
}

@observer
export default class MenuBar extends React.Component<IMenuBarProps, IMenuBarState> {

  constructor(props, context) {
    super(props, context);
  }
  
  componentWillMount() {
  }
  
  changePage = (newPage: PageTypes) => {
    this.props.appState.changePage(newPage);
  }

  render() {
    const { appState } = this.props;
    
    return (
      <div className="menubar">
        <div className="menubar-logo">
          THIS LITTLE CORNER
        </div>
        <div className="menubar-links">
          <div className={appState.currentPageType === PageTypes.Search ? "menubar-item active" : "menubar-item"}
               onClick={() => this.changePage(PageTypes.Search)}>Search</div>
          <div className={appState.currentPageType === PageTypes.Glossary ? "menubar-item active" : "menubar-item"}
               onClick={() => this.changePage(PageTypes.Glossary)}>Glossary</div>
          <div className={appState.currentPageType === PageTypes.Contact ? "menubar-item active" : "menubar-item"}
               onClick={() => this.changePage(PageTypes.Contact)}>Contact</div>
        </div>
      </div>
    );
  }
}
