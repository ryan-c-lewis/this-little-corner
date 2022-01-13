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
  EuiFlexItem, EuiPagination
} from '@elastic/eui'
import SearchQueryInput from "./SearchQueryInput";

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
    this.props.searchResultStore.goToPage(newPage);
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
          {searchResultStore.result?.items.map((hit) => (
              <EuiFlexGroup gutterSize="xl" key={hit.video_id}>
                <EuiFlexItem>
                  <EuiFlexGroup>
                    <EuiFlexItem grow={4}>
                      <EuiTitle size="xs">
                        <div>
                          <h4>{hit.title}</h4>
                          <h6>{hit.channel_name}</h6>
                          <h6>{hit.date}</h6>
                        </div>
                      </EuiTitle>
                      <EuiFlexGroup>
                        <EuiFlexItem grow={4}>
                          <iframe id={"video_" + hit.video_id} width="560" height="315" src={"https://www.youtube.com/embed/" + hit.video_id + "?enablejsapi=1"}
                                  title="YouTube video player" frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen />
                        </EuiFlexItem>
                        {/*<EuiFlexItem grow={4}>*/}
                        {/*  <div style={{'maxHeight': 315, 'overflowY': 'auto'}}>*/}
                        {/*    {GetMatchingPartsOfTranscript(data?.results.summary.query, hit.fields.transcript_parts).map((set) => (*/}
                        {/*        <div style={{'paddingBottom': 20}}>*/}
                        {/*          {set.map((part) => (*/}
                        {/*              <a href={"javascript:jump('video_" + hit.fields.video_id + "', " + part.start + ");"} key={part.start}><span>{part.text} </span></a>*/}
                        {/*          ))}*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*  </div>*/}
                        {/*</EuiFlexItem>*/}
                      </EuiFlexGroup>
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
            <EuiPageHeader>
              <SearchQueryInput newTodo={true}
                                onSave={this.handleSearch}
                                placeholder='What are you looking for?' />
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle size="s">
                    <h2>{GetResultsTitle()}</h2>
                  </EuiTitle>
                  <Pagination/>
                </EuiPageContentHeaderSection>
                <EuiPageContentHeaderSection>
                  <EuiFlexGroup>
                    <EuiFlexItem grow={1}>
                      {/*<SortingSelector data={data?.results} loading={loading} />*/}
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <ResultsList />
                <Pagination/>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}