import * as React from 'react';
import { observer } from 'mobx-react'
import { AppState } from '../store/AppState';
import {
  EuiFlexGroup,
  EuiFlexItem, EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiSpacer,
  EuiTitle
} from "@elastic/eui";

interface IGlossaryAppProps {
  appState: AppState
}

@observer
export default class GlossaryPage extends React.Component<IGlossaryAppProps, {}> {

  render() {
    const { appState } = this.props;

    return (
        <EuiPage>
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiTitle size="l">
                      <h1>Glossary</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiFlexGroup>
                  <EuiFlexItem>
                    Note: This page will be improved soon. For now, here's links to some common topics:
                  </EuiFlexItem>
                </EuiFlexGroup>
                {appState.topics.map((topic) => (
                    <EuiFlexGroup key={topic}>
                      <EuiFlexItem>
                        <a href={'/?q=' + topic}>{topic}</a>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                ))}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}