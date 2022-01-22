import * as React from 'react';
import { observer } from 'mobx-react'
import SearchPage from '../components/SearchPage';
import { SearchResultStore } from '../store/SearchResultStore';
import { AppState } from '../store/AppState';
import {SearchRequestModel} from "../model/SearchRequestModel";
import MenuBar from "../components/MenuBar";

interface IGlossaryAppProps {
  appState: AppState
}

@observer
export default class GlossaryApp extends React.Component<IGlossaryAppProps, {}> {

  render() {
    const { appState } = this.props;

    const query = new URLSearchParams(window.location.search);

    return (
      <div>
        <div>
          TODO: glossary here
        </div>
      </div>
    );
  }
}