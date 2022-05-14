import * as React from 'react';
import * as Autosuggest from "react-autosuggest";
import { debounce } from 'throttle-debounce'
import {AppState} from "../store/AppState";
import {SearchResultStore} from "../store/SearchResultStore";
import {Simulate} from "react-dom/test-utils";
import pause = Simulate.pause;

interface ISearchQueryInputProps {
  appState: AppState,
  searchResultStore: SearchResultStore,
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
    
    let getRandomTopic = () => {
      let items = this.props.appState.topics;
      return items[Math.floor(Math.random()*items.length)];
    };

    let searchBoxAnimationContext = 'pausing';
    let interval = 30;
    let pauseTime = 2000;
    let pauseUntil = Date.now() + 3000;
    let newWord = '';
    let timer = setInterval(() => {
      if (this.props.searchResultStore.searchHasHappened()) {
        clearInterval(timer);
        return;
      }
      
      if (searchBoxAnimationContext === 'pausing') {
        if (pauseUntil > Date.now()) {
          // just wait
        } else {
          searchBoxAnimationContext = 'deleting';
        }
      } else if (searchBoxAnimationContext === 'deleting') {
        let input = (document.querySelector("#searchBox input") as any);
        if (input.placeholder.length > 0) {
          let charactersToRemove = 1;
          if (input.placeholder[input.placeholder.length - 1] === ' ')
            charactersToRemove = 2;
          input.placeholder = input.placeholder.slice(0, -charactersToRemove);
        } else {
          searchBoxAnimationContext = 'typing';
          newWord = getRandomTopic();
        }
      } else if (searchBoxAnimationContext === 'typing') {
        let input = (document.querySelector("#searchBox input") as any);
        if (input.placeholder.length < newWord.length) {
          let charactersToAdd = 1;
          if (newWord[input.placeholder.length] === ' ')
            charactersToAdd = 2;
          input.placeholder = newWord.substr(0, input.placeholder.length + charactersToAdd);
        } else {
          searchBoxAnimationContext = 'pausing';
          pauseUntil = Date.now() + pauseTime;
        }
      }
    }, interval);
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
    value = value.toString().toLowerCase();
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
    (document.querySelector("#searchBox input") as any).disabled = !enabled;
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
      <div id={"searchBox"}>
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={suggestion => suggestion}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
        />
      </div>
    );
  }
}
