import * as React from 'react';
import {EuiSuperSelect} from "@elastic/eui";
import {useEffect, useState} from "react";
import {searchAPI} from '../apiclient';
import {SearchResultStore} from "../store/SearchResultStore";

interface IChannelSelectorProps {
  searchResultStore: SearchResultStore
}

export default function(props: IChannelSelectorProps) {
  const [channelOptions, setChannels] = useState([]);
  const [value, setValue] = useState("all");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsData = await searchAPI.getChannels();
        const channelOptions = channelsData.map(channel => ({ value: channel.Id, inputDisplay: channel.Name }));
        channelOptions.unshift({ value: "all", inputDisplay: "All Channels" });
        setChannels(channelOptions);

        const query = new URLSearchParams(window.location.search);
        const initialValue = query.get('channel') ?? (channelOptions[0]?.value || "all");
        setValue(initialValue);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    fetchChannels();
  }, []);

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
