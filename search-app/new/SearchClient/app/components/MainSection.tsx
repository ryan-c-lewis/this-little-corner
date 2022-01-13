import * as React from 'react';
import { observer } from 'mobx-react';
import SearchResultComponent from './SearchResult';
import Footer from './Footer';
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
  EuiFlexItem
} from '@elastic/eui'

interface IMainSectionProps {
  appState: AppState,
  searchResultStore: SearchResultStore
}

@observer
export default class MainSection extends React.Component<IMainSectionProps, {}> {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { searchResultStore, appState } = this.props;

    const GetResultsTitle = () => {
      if (searchResultStore.results == null)
        return "";
      let query = "change this";
      let total = 5;

      if (query !== "")
        return "Found " + total + " videos that discuss \"" + query + "\"";
      else
        return total + " videos to search through";
    }
    
    return (
        <EuiPage>
          <EuiPageBody component="div">
            <EuiPageHeader>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle size="s">
                    <h2>{GetResultsTitle()}</h2>
                  </EuiTitle>
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
                {/*<HitsList data={data} />*/}
                {/*<EuiFlexGroup justifyContent="spaceAround">*/}
                {/*  <Pagination data={data?.results} />*/}
                {/*</EuiFlexGroup>*/}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      // <section className='main'>
      //   {searchResultStore.results.map(searchResult =>
      //     <SearchResultComponent key={searchResult.video_id} searchResult={searchResult} />
      //   )}
      //   {this.renderFooter(0)}
      // </section>
    );
  }

  renderFooter(markedCount) {
    // const { todoStore, appState } = this.props;
    // const unmarkedCount = todoStore.todos.length - markedCount;
    //
    // if (todoStore.todos.length) {
    //   return (
    //     <Footer markedCount={todoStore.completedCount}
    //             unmarkedCount={todoStore.activeTodoCount}
    //             filter={appState.currentTodoFilter}
    //             onClearMarked={this.handleClearMarked}
    //             onShow={this.handleShow} />
    //   );
    // }
  }
}
