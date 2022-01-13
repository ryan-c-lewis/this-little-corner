import * as React from 'react';
import { observer } from 'mobx-react';
import SearchResultComponent from './SearchResult';
import Footer from './Footer';
import { AppState, SearchFilter } from '../store/AppState';
import { SearchResultStore } from '../store/SearchResultStore';

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

    return (
      <section className='main'>
        {searchResultStore.results.map(searchResult =>
          <SearchResultComponent key={searchResult.video_id} searchResult={searchResult} />
        )}
        {this.renderFooter(0)}
      </section>
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
