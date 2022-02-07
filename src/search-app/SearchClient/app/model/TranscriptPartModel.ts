import {observable} from "mobx";

export class TranscriptPartModel {
  text: string;
  start: number;
  duration: number;

  public constructor(init?:Partial<TranscriptPartModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      text: this.text,
      start: this.start,
      duration: this.duration
    }
  }
}