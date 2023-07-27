import * as React from 'react';
import {EuiSuperSelect} from "@elastic/eui";
import {useState} from "react";
import {SearchResultStore} from "../store/SearchResultStore";

interface IChannelSelectorProps {
  searchResultStore: SearchResultStore
}

export default function(props: IChannelSelectorProps) {
  
  const channelOptions = [
    {
      value: 'all',
      inputDisplay: 'All Channels',
    },
    {
      value: 'UC6vg0HkKKlgsWk-3HfV-vnw',
      inputDisplay: 'A Quality Existence',
    },
    {
      value: 'UCeWWxwzgLYUbfjWowXhVdYw',
      inputDisplay: 'Andrea with the Bangs',
    },
    {
      value: 'UCiJmdXTb76i8eIPXdJyf8ZQ',
      inputDisplay: 'Bridges of Meaning Hub',
    },
    {
      value: 'UCuex29iuR-bNNMZZXTw4JpQ',
      inputDisplay: 'Chad the Alcoholic',
    },
    {
      value: 'UC6Tvr9mBXNaAxLGRA_sUSRA',
      inputDisplay: 'Colton Kirby',
    },
    {
      value: 'UCsi_x8c12NW9FR7LL01QXKA',
      inputDisplay: 'Grail Country',
    },
    {
      value: 'UCAqTQ5yLHHH44XWwWXLkvHQ',
      inputDisplay: 'Grizwald Grim',
    },
    {
      value: 'UCprytROeCztMOMe8plyJRMg',
      inputDisplay: 'Jacob',
    },
    {
      value: 'UCpqDUjTsof-kTNpnyWper_Q',
      inputDisplay: 'John Vervaeke',
    },
    {
      value: 'UCL_f53ZEJxp8TtlOkHwMV9Q',
      inputDisplay: 'Jordan Peterson',
    },
    {
      value: 'UC2leFZRD0ZlQDQxpR2Zd8oA',
      inputDisplay: 'Mary Kochan',
    },
    {
      value: 'UC8SErJkYnDsYGh1HxoZkl-g',
      inputDisplay: 'Michael Sartori',
    },
    {
      value: 'UCEPOn4cgvrrerg_-q_Ygw1A',
      inputDisplay: 'More Christ'
    },
    {
      value: 'UC2yCyOMUeem-cYwliC-tLJg',
      inputDisplay: 'Paul Anleitner',
    },
    {
      value: 'UCGsDIP_K6J6VSTqlq-9IPlg',
      inputDisplay: 'Paul Vander Klay',
    },
    {
      value: 'UCEzWTLDYmL8soRdQec9Fsjw',
      inputDisplay: 'Randos United',
    },
    {
      value: 'UCFQ6Gptuq-sLflbJ4YY3Umw',
      inputDisplay: 'Rebel Wisdom',
    },
    {
      value: 'UCIAtCuzdvgNJvSYILnHtdWA',
      inputDisplay: 'The Andromist',
    },
    {
      value: 'UClIDP7_Kzv_7tDQjTv9EhrA',
      inputDisplay: 'The Chris Show',
    },
    {
      value: 'UC-QiBn6GsM3JZJAeAQpaGAA',
      inputDisplay: 'The Common Toad',
    },
    {
      value: 'UCM9Z05vuQhMEwsV03u6DrLA',
      inputDisplay: 'The Information Addict',
    },
    {
      value: 'UCgp_r6WlBwDSJrP43Mz07GQ',
      inputDisplay: 'The Meaning Code',
    },
    {
      value: 'UCtCTSf3UwRU14nYWr_xm-dQ',
      inputDisplay: 'The Symbolic World',
    },
    {
      value: 'UCg7Ed0lecvko58ibuX1XHng',
      inputDisplay: 'Transfigured',
    }];

  const query = new URLSearchParams(window.location.search);
  const initialValue = query.get('channel') ?? channelOptions[0].value;
  const [value, setValue] = useState(initialValue);

  const changeSort = (newValue) => {
    setValue(newValue);
    props.searchResultStore.changeChannel(newValue);
  };

    return (
        <EuiSuperSelect
            options={channelOptions}
            valueOfSelected={value}
            onChange={(value) => changeSort(value)}
        />
    );
}
