import * as React from 'react';
import * as Autosuggest from "react-autosuggest";
import { debounce } from 'throttle-debounce'
import {AppState} from "../store/AppState";

interface ISearchQueryInputProps {
  appState: AppState,
  onSave(text: string): Promise<any>,
}

interface ISearchQueryInputState {
  value: string,
  suggestions: any[]
}

export default class SearchQueryInput extends React.Component<ISearchQueryInputProps, ISearchQueryInputState> {

  constructor(props, context) {
    super(props, context);
    const query = new URLSearchParams(window.location.search);
    const initialValue = query.get('q') ?? '';
    this.state = {
      value: initialValue,
      suggestions: []
    };
  }

  previousSubmitValue: string;
  
  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
        100,
        this.onSuggestionsFetchRequested
    )
  }

  renderSuggestion = suggestion => {
    return (
        <div className="result">
          <div>{suggestion}</div>
        </div>
    )
  }

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    let options = new Set();
    let max = 10;
    for (let i = 0; i < this.props.appState.topics.length; i++) {
      if (this.props.appState.topics[i].startsWith(value))
        options.add(this.props.appState.topics[i]);
      if (options.size >= max)
        break;
    }
    for (let i = 0; i < this.props.appState.topics.length; i++) {
      if (this.props.appState.topics[i].includes(value) && !options.has(this.props.appState.topics[i]))
        options.add(this.props.appState.topics[i]);
      if (options.size >= max)
        break;
    }
    this.setState({ suggestions: Array.from(options) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  onKeyDown = (event) => {
    if (event.key === 'Enter')
      this.onSubmit(this.state.value);
  }

  onSuggestionSelected = (event, { suggestionValue }) => {
    this.onSubmit(suggestionValue);
  }
  
  onSubmit = (value) => {
    if (value === this.previousSubmitValue)
      return;
    this.previousSubmitValue = value;
    this.setEnablement(false);
    this.props.onSave(value).then(() => {
      this.setEnablement(true);
    });
  }
  
  setEnablement = (enabled: boolean) => {
    (document.getElementsByClassName('react-autosuggest__input')[0] as any).disabled = !enabled;
  }

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: 'Search',
      value,
      onKeyDown: this.onKeyDown,
      onChange: this.onChange,
    }
    
    return (
      <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={suggestion => suggestion}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
      />
    );
  }
}
