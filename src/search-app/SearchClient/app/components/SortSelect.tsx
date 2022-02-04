import * as React from 'react';
import {EuiSuperSelect} from "@elastic/eui";
import {useState} from "react";
import {SearchResultStore} from "../store/SearchResultStore";

interface ISortSelectorProps {
  searchResultStore: SearchResultStore
}

export default function(props: ISortSelectorProps) {
  
  const sortOptions = [
    {
      value: 'newer',
      inputDisplay: 'Sort by Newest',
    },
    {
      value: 'older',
      inputDisplay: 'Sort by Oldest',
    }];

  const query = new URLSearchParams(window.location.search);
  const initialValue = query.get('sort') ?? sortOptions[0].value;
  const [value, setValue] = useState(initialValue);

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
