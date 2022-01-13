import { observable } from 'mobx';

export class SearchResultModel {
  video_id: string;
  channel_id: string;
  channel_name: string;
  title: string;
  url: string;
  date: string;
  description: string;
  duration: number;

  public constructor(init?:Partial<SearchResultModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      video_id: this.video_id,
      channel_id: this.channel_id,
      channel_name: this.channel_name,
      title: this.title,
      url: this.url,
      date: this.date,
      description: this.description,
      duration: this.duration
    }
  }
};