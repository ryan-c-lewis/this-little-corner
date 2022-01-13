import * as React from 'react';
import { observer } from 'mobx-react';
import { AppState, SearchFilter } from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiButtonGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSuperSelect
} from '@elastic/eui'
import SearchQueryInput from "./SearchQueryInput";
import {useState} from "react";

interface IMainSectionProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class MainSection extends React.Component<IMainSectionProps, {}> {

  constructor(props, context) {
    super(props, context);
  }

  handleSearch = (text: string) => {
    if (text.length !== 0) {
      this.props.searchResultStore.newSearch(text);
    }
  }

  changePage = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.props.searchResultStore.goToPage(newPage);
  }

  render() {
    const { searchResultStore, appState } = this.props;

    // const sortOptions = [
    //   {
    //     value: 'newer',
    //     inputDisplay: 'Newer',
    //   },
    //   {
    //     value: 'older',
    //     inputDisplay: 'Older',
    //   }];
    // const [value, setValue] = useState(sortOptions[0].value);
    //
    // const changeSort = (newValue) => {
    //   setValue(newValue);
    //   searchResultStore.changeSort(newValue);
    // };

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
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl" key={hit.video_id}>
                    <EuiFlexItem grow={10}>
                      <EuiTitle size="xs">
                        <div>
                          <h4>{hit.title}</h4>
                          <h6>{hit.channel_name}</h6>
                          <h6>{hit.date}</h6>
                        </div>
                      </EuiTitle>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiFlexGroup>
                    <EuiFlexItem grow={5}>
                      <iframe id={"video_" + hit.video_id} width="560" height="315" src={"https://www.youtube.com/embed/" + hit.video_id + "?enablejsapi=1"}
                              title="YouTube video player" frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen />
                    </EuiFlexItem>
                    <EuiFlexItem grow={5}>
                      <div style={{'maxHeight': 315, 'overflowY': 'auto'}}>
                        {hit.transcriptPartGroups?.map((group) => (
                            <div style={{'paddingBottom': 20}}>
                              {group.transcriptParts.map((part) => (
                                  <a href={"javascript:jump('video_" + hit.video_id + "', " + part.start + ");"} key={part.start}><span>{part.text} </span></a>
                              ))}
                            </div>
                        ))}
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
          ))}
        </>
    )


    return (
        <EuiPage>
          <EuiPageBody component="div">
            {/*<EuiPageHeader>*/}
              {/*<EuiSuperSelect*/}
              {/*    options={sortOptions}*/}
              {/*    valueOfSelected={value}*/}
              {/*    onChange={(value) => changeSort(value)}*/}
              {/*/>*/}
            {/*</EuiPageHeader>*/}
            <EuiPageHeader>
              <EuiFlexGroup justifyContent="spaceAround">
                <SearchQueryInput newTodo={true}
                                  onSave={this.handleSearch}
                                  placeholder='Search' />
              </EuiFlexGroup>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiFlexGroup>
                <EuiFlexItem>
                    <h2>{GetResultsTitle()}</h2>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup justifyContent="spaceAround">
                <Pagination/>
              </EuiFlexGroup>
              <EuiPageContentBody>
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