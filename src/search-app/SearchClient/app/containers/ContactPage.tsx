import * as React from 'react';
import { observer } from 'mobx-react'
import { AppState } from '../store/AppState';
import {
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem, EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiTextArea,
  EuiTitle,
} from "@elastic/eui";
import {observable} from "mobx";
import {SearchResultStore} from "../store/SearchResultStore";

interface IContactPageProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class ContactPage extends React.Component<IContactPageProps, {}> {

  @observable
  sent: boolean;
  
  sendMessage = () => {
    this.sent = true;
    const address = (document.getElementById("input_email") as HTMLInputElement).value;
    const body = (document.getElementById("input_body") as HTMLInputElement).value;
    this.props.searchResultStore.submitContactForm(address, body);
  }

  render() {
    const { appState } = this.props;

    return (
        <EuiPage>
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <div>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiTitle size="l">
                        <h1>Contact</h1>
                      </EuiTitle>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </div>
                <div id={"stuff_beforeSend"} hidden={this.sent}>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <div>
                        Feedback, questions, whatever. Fill out this form or contact @Ryan Lewis on the "Bridges of Meaning" Discord server (which you can find a link to in one of Paul Vander Klay's most recent videos.)
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiFieldText id={"input_email"} placeholder={"Email"} />
                      <EuiTextArea id={"input_body"} placeholder={"Message"} rows={5} cols={50} />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiButton id={"input_submit"} onClick={this.sendMessage}>Send</EuiButton>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </div>
                <div id={"stuff_afterSend"} hidden={!this.sent}>
                  Thanks!
                </div>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}