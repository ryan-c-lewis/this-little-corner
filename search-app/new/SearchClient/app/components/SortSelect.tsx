import * as React from 'react';
import {EuiSuperSelect} from "@elastic/eui";
import {useState} from "react";
import {SearchResultStore} from "../store/SearchResultStore";
import {AppState} from "../store/AppState";

interface ISortSelectorProps {
  searchResultStore: SearchResultStore
}

export default function(props: ISortSelectorProps) {
  
  const sortOptions = [
    {
      value: 'newer',
      inputDisplay: 'Newer',
    },
    {
      value: 'older',
      inputDisplay: 'Older',
    }];

  const [value, setValue] = useState(sortOptions[0].value);

  const changeSort = (newValue) => {
    setValue(newValue);
    props.searchResultStore.changeSort(newValue);
  };

    return (
        <EuiSuperSelect
            options={sortOptions}
            valueOfSelected={value}
            onChange={(value) => changeSort(value)}
        />
    );
}
