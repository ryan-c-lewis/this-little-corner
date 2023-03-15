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
import { LazyLoadComponent } from 'react-lazy-load-image-component';

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
            <EuiAccordion id={'video_' + inputs.title} buttonContent={inputs.title}>
              <div>
                <EuiFlexGroup>
                  {inputs.videos.map(x => (
                    <EuiFlexItem>
                      <div className="video-container">
                        <LazyLoadComponent>
                          <iframe src={'https://www.youtube.com/embed/' + x}
                                  loading={'lazy'}
                                  title="YouTube video player" frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen />
                        </LazyLoadComponent>
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
                <Term title={"4 Kinds of Knowing (Propositional, Procedural, Perspectival, Participatory)"} videos={['Gyx5tyFttfA']}/>
                <Term title={"Agent and Arena"} videos={['yy47YzvGniQ?start=1824', 'Q8NrCR4ifoo?start=1148']}/>
                <Term title={"Bounded-set Thinking versus Centered-set Thinking"} videos={['jugwCxdncp8?start=1336', 'oiyTfN3gRjg?start=637']}/>
                <Term title={"Bullshit"} videos={['syWfyTMzSSw?start=2044', '54l8_ewcOlY?start=335']}/>
                <Term title={"Combinatorial Explosion"} videos={['6V1eMvGGcXQ?start=529', 'JZogi3h3pbA?start=1159', '9j5O-tnaFzE']}/>
                <Term title={"Dialogos"} videos={['FdZlQYtIJ0Q?start=4417', 'bPy6W-c5_9Y?start=1474']}/>
                <Term title={"Disenchantment and Re-enchantment"} videos={['v92aB64jio4?start=348', 'cv0kF3dCX0w']} />
                <Term title={"Distributed Cognition"} videos={['54l8_ewcOlY?start=2030', '2fUY046brGM?start=2950']}/>
                <Term title={"Dominance Hierarchies"} videos={['EN2lyN7rM4E?start=418', 'RcmWssTLFv0?start=2522', '0cLLFSdKZLI?start=480']}/>
                <Term title={"Egregore"} videos={['PpWxe1kGOTA?start=2504', '4IjW16FCpkA?start=892']} />
                <Term title={"Emergence versus Emanation"} videos={['ZxKPl0IYzOA?start=2617', 'MhkCYrhzPQk?start=2934', 'N1byG4RqoTg?start=2630']} />
                <Term title={"Explored Territory and Unexplored Territory (Known and Unknown, Order and Chaos)"} videos={['6Rd10PQVsGs?start=2137', 'EN2lyN7rM4E?start=4006']}/>
                <Term title={"Garments of Skin"} videos={['-drIcL5bkpk?start=225', 'zXOdlIXDsr8?start=806', 'k4W0b-hmG1E']} />
                <Term title={"Gentle Slope and Steep Slope"} videos={['-vzJ_Z26SdY?start=1289']} />
                <Term title={"God #1 and God #2"} videos={['G19xovk0F0s?start=2587', 'U0VqRxNRyyI?start=266']} />
                <Term title={"Having Mode versus Being Mode"} videos={['yy47YzvGniQ?start=2868', '0jArHxAnXoQ?start=4311']} />
                <Term title={"Homo Duplex"} videos={['IXgdRQgZNJE?start=3136', 'FbTzqfU5ZbU?start=708']} />
                <Term title={"Meaning Crisis"} videos={['iSwAbQD-gZU', 'ncd6q9uIEdw']} />
                <Term title={"Metadivine Realm"} videos={['7LbCZ4_Wmkw?start=1389', 'nsQWCZFmRx0?start=408']} />
                <Term title={"Monarchical Vision"} videos={['ugf6Z6XohEQ?start=234', 'MWVriIxLZVc?start=253']} />
                <Term title={"Optimal Grip"} videos={['dRzm_wSR1RU?start=1293', '39NpjQDtqNw?start=2087']} />
                <Term title={"Psychotechnologies"} videos={['2PGglfl5j_I?start=1333', 'KnAT3cBr6EA?start=146']} />
                <Term title={"Quantity versus Quality"} videos={['gNpUKrZK2kw?start=5394']} />
                <Term title={"Recursive Relevance Realization"} videos={['syWfyTMzSSw?start=1223', 'hz3mEYdJEvY?start=4125']} />
                <Term title={"Relevance Realization"} videos={['WpVVcVRkLok?start=67', '2PGglfl5j_I?start=432']} />
                <Term title={"Religion that is not a Religion"} videos={['440NV0eer00']} />
                <Term title={"Salience Landscape"} videos={['syWfyTMzSSw?start=774', '2PGglfl5j_I?start=731']} />
                <Term title={"Secret Sacred Self"} videos={['uJYbU9yMPLE?start=6047', 'qvWHODDj4jQ?start=3408']} />
                <Term title={"Sense Making"} videos={['BtkwF5qA6uE?start=65', 'AZyyKX8jsZc?start=3090']} />
                <Term title={"Spirit of Math/Geometry versus Spirit of Finesse"} videos={['ky7-tT7fqFE?start=2736']} />
                <Term title={"Structural Functional Organization"} videos={['neDutbcedUY?start=3192']} />
                <Term title={"This Little Corner of the Internet"} videos={['5tOdjXQgISE?start=26']} />
                <Term title={"Upper Register and Lower Register"} videos={['40ao7O33MDs?start=3703']} />
                <Term title={"Zone of Proximal Development"} videos={['kteHW6t4G0g?start=1068']} />
                <EuiSpacer />
                <EuiSpacer />
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiTitle>
                      <h1>Miscellaneous Terms</h1>
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