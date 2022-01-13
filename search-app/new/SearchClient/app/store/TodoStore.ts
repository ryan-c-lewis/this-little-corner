import { observable, action, computed } from 'mobx';
import { TodoItem } from '../model/TodoItem';
import { todosApi } from '../apiclient';

export class TodoStore {

  @observable todos: TodoItem[] = [];

  @observable isLoading: boolean = false;

  @computed get activeTodoCount(): number {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount(): number {
		return this.todos.length - this.activeTodoCount;
	}

  @action loadTodos(): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action search(todo: string): Promise<any> {
    return todosApi.search(todo)
      .then(action((data: any) => {
        this.todos.push(new TodoItem(data));
      }));
  }

  @action editTodo(id: number, title: string): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action deleteTodo(id: number): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action toggleCompleted(id: number): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action markAllCompleted(): Promise<any> {
    return new Promise<any>(() => {});
  }

  @action clearCompleted(): Promise<any> {
    return new Promise<any>(() => {});
  }
}