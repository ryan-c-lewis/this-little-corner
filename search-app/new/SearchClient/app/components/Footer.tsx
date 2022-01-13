import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from "classnames";
import { SearchFilter } from '../store/AppState';

const FILTER_TITLES = {
  [SearchFilter.All]: 'All',
  [SearchFilter.Active]: 'Active',
  [SearchFilter.Completed]: 'Completed'
};

interface IFooterProps {
  markedCount: number,
  unmarkedCount: number,
  filter: SearchFilter,
  onClearMarked(): void,
  onShow(filter: SearchFilter): void
}

@observer
export default class Footer extends React.Component<IFooterProps, {}> {

  render() {
    const filters: SearchFilter[] = Object.keys(SearchFilter)
      .filter(key => !isNaN(Number(SearchFilter[key])))
      .map(key => SearchFilter[key]);
    return (
      <footer className='footer'>
        {this.renderTodoCount()}
        <ul className='filters'>
          {filters.map(filter =>
            <li key={filter}>
              {this.renderFilterLink(filter)}
            </li>
          )}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }

  renderTodoCount() {
    const { unmarkedCount } = this.props;
    const itemWord = unmarkedCount === 1 ? 'item' : 'items';

    return (
      <span className='todo-count'>
        <strong>{unmarkedCount || 'No'}</strong> {itemWord} left
      </span>
    );
  }

  renderFilterLink(filter: SearchFilter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <a className={classNames({ selected: filter === selectedFilter })}
         style={{ cursor: 'hand' }}
         onClick={() => onShow(filter)}>
        {title}
      </a>
    );
  }

  renderClearButton() {
    const { markedCount, onClearMarked } = this.props;
    if (markedCount > 0) {
      return (
        <button className='clear-completed'
                onClick={onClearMarked} >
          Clear completed
        </button>
      );
    }
  }
}
