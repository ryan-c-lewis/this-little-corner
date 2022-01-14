import * as React from 'react';
import classNames from "classnames";
import {EuiSearchBar} from "@elastic/eui/src/components/search_bar/search_bar";
import {EuiFieldSearch} from "@elastic/eui";

interface ITodoTextInputProps {
  onSave(text: string): void,
  newTodo?: boolean,
  text?: string,
  editing?: boolean,
  placeholder?: string
}

interface ISearchQueryInputState {
  text: string
}

export default class SearchQueryInput extends React.Component<ITodoTextInputProps, ISearchQueryInputState> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || ''
    };
  }
  
  loading = false;

  handleSubmit = (value) => {
    const text = value.trim();
      this.props.onSave(text);
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleBlur = (e) => {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  }

  render() {
    return (
        <EuiFieldSearch
            placeholder="Search"
            value={this.state.text}
            onChange={this.handleChange}
            isLoading={this.loading}
            onSearch={this.handleSubmit}
            isClearable
            aria-label="Search"
        />
      // <input 
      //     className={classNames({
      //         'edit': this.props.editing,
      //         'new-todo': this.props.newTodo
      //        })}
      //        type='text'
      //        placeholder={this.props.placeholder}
      //        autoFocus={true}
      //        value={this.state.text}
      //        onBlur={this.handleBlur}
      //        onChange={this.handleChange}
      //        onKeyDown={this.handleSubmit} />
    );
  }
}
