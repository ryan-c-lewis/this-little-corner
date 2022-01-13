import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { SearchResultModel as SearchResultModel } from '../model/SearchResultModel';
import { SearchResultStore } from '../store/SearchResultStore';

interface ISearchResultProps {
  searchResult: SearchResultModel,
  searchResultStore?: SearchResultStore
}

interface ISearchResultState {
  editing: boolean
}

@inject('searchResultStore')
@observer
export default class SearchResult extends React.Component<ISearchResultProps, ISearchResultState> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  render() {
    const {searchResult, searchResultStore} = this.props;

    return (
      <label>
        {searchResult.title}
      </label>
    );
  }
}
