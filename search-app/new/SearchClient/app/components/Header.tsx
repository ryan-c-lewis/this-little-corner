import * as React from 'react';
import SearchQueryInput from './SearchQueryInput';
import { SearchResultStore } from '../store/SearchResultStore';

interface IHeaderProps {
  searchResultStore: SearchResultStore
}

export default class Header extends React.Component<IHeaderProps, any> {

  handleSearch = (text: string) => {
    if (text.length !== 0) {
      this.props.searchResultStore.search(text);
    }
  }

  render() {
    return (
      <header className='header'>
          <h1>todos</h1>
          <SearchQueryInput newTodo={true}
                            onSave={this.handleSearch}
                            placeholder='What are you looking for?' />
      </header>
    );
  }
}
