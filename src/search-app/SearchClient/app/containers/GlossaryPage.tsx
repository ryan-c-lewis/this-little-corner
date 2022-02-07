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
  EuiTitle,
  EuiAccordion, EuiPagination
} from "@elastic/eui";

interface IGlossaryAppProps {
  appState: AppState
}

@observer
export default class GlossaryPage extends React.Component<IGlossaryAppProps, {}> {

  render() {
    const { appState } = this.props;

    const Term = (inputs: any) => (
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiAccordion id={'video_' + inputs.title} buttonContent={inputs.title} >
              <div>
                <EuiFlexGroup>
                  {inputs.videos.map(x => (
                    <EuiFlexItem>
                      <div className="video-container">
                        <iframe src={'https://www.youtube.com/embed/' + x}
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen />
                      </div>
                    </EuiFlexItem>
                  ))}
                </EuiFlexGroup>
              </div>
            </EuiAccordion>
          </EuiFlexItem>
        </EuiFlexGroup>
    )

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
                    <EuiTitle>
                      <h1>Important Terms</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <Term title={"4 Kinds of Knowing ("} videos={['Gyx5tyFttfA']}/>
                <Term title={"Agent and Arena"} videos={['yy47YzvGniQ?start=1824', 'Q8NrCR4ifoo?start=1148']}/>
                <Term title={"Combinatorial Explosion"} videos={['6V1eMvGGcXQ?start=529', 'JZogi3h3pbA?start=1159', '9j5O-tnaFzE']}/>
                <Term title={"Dialogos"} videos={['FdZlQYtIJ0Q?start=4417', 'bPy6W-c5_9Y?start=1474']}/>
                <Term title={"God #1 and God #2"} videos={['G19xovk0F0s?start=2587', 'U0VqRxNRyyI?start=266']} />
                <EuiSpacer />
                <EuiSpacer />
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiTitle>
                      <h1>All Terms</h1>
                    </EuiTitle>
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