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
  EuiSpacer,
  EuiTextArea,
  EuiTitle,
} from "@elastic/eui";
import {observable} from "mobx";
import {SearchResultStore} from "../store/SearchResultStore";

interface IFAQPageProps {
  appState: AppState
}

@observer
export default class FAQPage extends React.Component<IFAQPageProps, {}> {

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
                        <h1>FAQ</h1>
                      </EuiTitle>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </div>
                <div>
                  <EuiFlexGroup>
                    <EuiSpacer/>
                    <EuiFlexItem>
                      <div>
                        <b>Q: What is this site?</b><br/>
                        A: This site is primarily a search engine. There are a lot of interesting philosophical/theological/cultural dialogues happening between a certain group of YouTubers (centered around Paul Vander Klay, John Vervaeke, Jonathan Pageau, etc.) but it is hard to keep up with all the content in these videos. This site is an attempt to address that problem. YouTube automatically transcribes the words of all videos, and this search engine looks through the video transcripts for you.
                        <br/><br/>
                        <b>Q: Why is my search not returning any results?</b><br/>
                        A: Currently the search algorithm is very crude; it only looks for exact matches. So if you type "Jordan Peterson Noah's ark" you won't get any results, because it's going to look for literally the phrase "Jordan Peterson Noah's ark". You'll have to narrow down your search to one key word/phrase at a time.
                        <br/><br/>
                        <b>Q: Why the name "This Little Corner"?</b><br/>
                        A: I don't know who started it, but people have been calling these YouTube channels (and their associated Discord servers) "This Little Corner of the Internet"
                        <br/><br/>
                        <b>Q: Why is there a Glossary page?</b><br/>
                        A: There is a lot of insider-lingo in these videos. The Glossary page links to videos containing the clearest explanations of the terms.
                        <br/><br/>
                        <b>Q: Which channels are searchable?</b><br/>
                        A: You can see the list of channels in the dropdown on the righthand side of the Search page. The list is pretty arbitrary. It's mostly just channels of people involved in the "Bridges of Meaning" Discord server. If you want your channel added, contact me (@Ryan Lewis) on the Discord server.
                        <br/><br/>
                        <b>Q: How do I get access to the "Bridges of Meaning" Discord server?</b><br/>
                        A: There is no permanent link to the server because we're trying to avoid spam. Paul Vander Klay puts temporary links to the server in his video descriptions. Go look at the most recent few of his videos and hopefully you will find a link.
                        <br/><br/>
                        <b>Q: How often are new videos added?</b><br/>
                        A: Unfortunately I can't make this happen automatically because YouTube doesn't like automated bots scraping their transcript data, so I have to run a script manually from my personal computer. I usually remember to do it every day, but sometimes I forget. (If anybody can help me solve this problem, please contact me!)
                        <br/><br/>
                        <b>Q: How can I contribute to this project?</b><br/>
                        A: Mostly I'm just looking for ideas and feedback. I really want to figure out how to make the content of these videos accessible to more people. Also the site's source is on GitHub--but be warned, it's messy because this project started simply as an excuse for me to learn React: <a href={"https://github.com/ryan-c-lewis/this-little-corner"}>https://github.com/ryan-c-lewis/this-little-corner</a>
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </div>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}