import * as React from 'react';
import { observer } from 'mobx-react';
import { AppState } from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSpacer
} from '@elastic/eui'
import SearchQueryInput from "../components/SearchQueryInput";
import SortSelect from "../components/SortSelect";
import {SearchRequestModel} from "../model/SearchRequestModel";
import ChannelSelect from "../components/ChannelSelect";
import {TranscriptPartGroupModel} from "../model/TranscriptPartGroupModel";
import {ObservableArray} from "mobx/lib/types/observablearray";

interface ISearchPageProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class SearchPage extends React.Component<ISearchPageProps, {}> {

  constructor(props, context) {
    super(props, context);
  }
  
  componentWillMount() {
    const query = new URLSearchParams(window.location.search);
    this.props.searchResultStore.init(new SearchRequestModel({
      sort: query.get('sort') ?? 'newer',
      channel: query.get('channel') ?? 'all',
      query: query.get('q') ?? '',
      pageSize: parseInt(query.get('size') ?? '10'),
      page: parseInt(query.get('page') ?? '0')}));
  }

  handleSearch = (text: string) => {
    return this.props.searchResultStore.changeQuery(text);
  }

  changePage = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.props.searchResultStore.goToPage(newPage);
  }

  seeFullTranscript = (video_id: string) => {
    this.props.searchResultStore.seeFullTranscript(video_id);
  }

  render() {
    const { searchResultStore, appState } = this.props;

    const GetResultsTitle = () => {
      if (searchResultStore.result == null)
        return "";
      let query = searchResultStore.lastRequest.query;
      let total = searchResultStore.result.totalResults;

      if (query !== "")
        return "Found " + total + " videos that discuss \"" + query + "\"";
      else
        return total + " videos to search through";
    }
    
    const ToTimestamp = (raw: number) => {
      let pretty = new Date(raw * 1000).toISOString().substr(12, 7);
      if (pretty.startsWith('0:')) // don't include hour if 00
        pretty = pretty.substr(2);
      return pretty;
    }

    function postMessageToPlayer(iframe, func, args) {
      iframe.contentWindow.postMessage(JSON.stringify({
        'event': 'command',
        'func': func,
        'args': args || []
      }), '*');
    }
    function pauseAllExcept(iframeToIgnore) {
      var i, frames;
      frames = document.getElementsByTagName("iframe");
      for (i = 0; i < frames.length; ++i) {
        if (frames[i] === iframeToIgnore)
          continue;
        postMessageToPlayer(frames[i], "pauseVideo", []);
      }
    }
    function jump(id, time) {
      let iframe = document.getElementById(id);
      pauseAllExcept(iframe);
      postMessageToPlayer(iframe, "seekTo", [time, true]);
      postMessageToPlayer(iframe, "playVideo", []);
    }
    function setupCallPlayer() {
      if (typeof window === 'undefined')
        return;
      window['jump'] = jump;
    }

    const Pagination = () => (
        <EuiPagination
            aria-label="Pagination"
            pageCount={searchResultStore.result?.totalPages}
            activePage={searchResultStore.result?.currentPage}
            onPageClick={(page) => {
              this.changePage(page);
            }}
        />
    )


    const ResultsList = () => (
        <>
          {setupCallPlayer()}
          {searchResultStore.result?.items.map((hit) => (
              <EuiFlexGroup key={hit.video_id}>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    <EuiFlexItem grow={10}>
                      <EuiTitle size="xs">
                        <div>
                          <h4>{hit.title}</h4>
                          <h6>{hit.channel_name}</h6>
                          <h6>{hit.date.split('T')[0]}</h6>
                        </div>
                      </EuiTitle>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiFlexGroup>
                    <EuiFlexItem grow={5}>
                      <div className="video-container">
                        <iframe id={"video_" + hit.video_id} src={"https://www.youtube.com/embed/" + hit.video_id + "?enablejsapi=1"}
                                title="YouTube video player" frameBorder="0"
                                // style={{maxWidth:"560", maxHeight:"315" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen />
                      </div>
                    </EuiFlexItem>
                    <EuiFlexItem grow={5}>
                      <div style={{'maxHeight': 315, 'overflowY': 'auto'}}>
                        {hit.transcriptData?.transcriptPartGroups.map((group) => (
                            <div key={'transcript_group_' + hit.video_id + '_' + group.transcriptParts[0].start}>
                              <div style={{'paddingBottom': 20}}>
                                {group.transcriptParts.map((part) => (
                                    <div key={'transcript_part_' + hit.video_id + '_' + part.start}>
                                      <a href={"javascript:jump('video_" + hit.video_id + "', " + part.start + ");"} key={part.start}>{ToTimestamp(part.start)}</a>
                                      <span> - {part.text}</span>
                                    </div>
                                ))}
                              </div>
                              <div style={{'paddingBottom': 20}}>
                                ...
                              </div>
                            </div>
                        ))}
                        <div style={{'paddingBottom': 20}}>
                          <a onClick={() => this.seeFullTranscript(hit.video_id)}>(see full transcript)</a>
                        </div>
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiSpacer />
                </EuiFlexItem>
              </EuiFlexGroup>
          ))}
        </>
    )


    return (
        <EuiPage>
          <EuiPageBody component="div">
            <EuiPageHeader>
              <EuiFlexGroup justifyContent="spaceAround">
                <SearchQueryInput appState={appState} onSave={this.handleSearch} />
              </EuiFlexGroup>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup justifyContent="spaceBetween">
                  <EuiFlexItem grow={false}>
                    <EuiTitle size="l">
                      <h1>{GetResultsTitle()}</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false} style={{'width': '200px'}}>
                    <ChannelSelect searchResultStore={this.props.searchResultStore}/>
                    <SortSelect searchResultStore={this.props.searchResultStore}/>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup justifyContent="spaceAround">
                  <Pagination/>
                </EuiFlexGroup>
                <EuiSpacer />
                <ResultsList />
              </EuiPageContentBody>
              <EuiFlexGroup justifyContent="spaceAround">
                <Pagination/>
              </EuiFlexGroup>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}