import * as React from 'react';
import { observer } from 'mobx-react';
import TodoItemComponent from './TodoItem';
import Footer from './Footer';
import { AppState, TodoFilter } from '../store/AppState';
import { TodoStore } from '../store/TodoStore';

const TODO_FILTERS = {
  [TodoFilter.All]: () => true,
  [TodoFilter.Active]: todo => !todo.completed,
  [TodoFilter.Completed]: todo => todo.completed
};

interface IMainSectionProps {
  appState: AppState,
  todoStore: TodoStore
}

@observer
export default class MainSection extends React.Component<IMainSectionProps, {}> {

  constructor(props, context) {
    super(props, context);
  }

  handleClearMarked = () => {
  }

  handleMarkAllCompleted = () => {
  }

  handleShow = (filter: TodoFilter) => {
    this.props.appState.setTodoFilter(filter);
  }

  render() {
    const { todoStore, appState } = this.props;

    const filteredTodos = todoStore.todos.filter(TODO_FILTERS[appState.currentTodoFilter]);

    return (
      <section className='main'>
        {this.renderToggleAll(0)}
        <ul className='todo-list'>
          {filteredTodos.map(todo =>
            <TodoItemComponent key={todo.id} todo={todo} />
          )}
        </ul>
        {this.renderFooter(0)}
      </section>
    );
  }

  renderToggleAll(completedCount) {
    // const { todoStore } = this.props;
    // if (todoStore.todos.length > 0) {
    //   return (
    //     <div>
    //       <input id='toggle-all'
    //             className='toggle-all'
    //             type='checkbox'
    //             checked={completedCount === todoStore.todos.length}
    //             onChange={this.handleMarkAllCompleted} />
    //       <label htmlFor='toggle-all' />
    //     </div>
    //   );
    // }
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
