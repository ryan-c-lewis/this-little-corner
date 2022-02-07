import {observable} from "mobx";
import {TranscriptPartGroupModel} from "./TranscriptPartGroupModel";

export class TranscriptDataModel {
  transcriptPartGroups: TranscriptPartGroupModel[];

  public constructor(init?:Partial<TranscriptDataModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      transcriptPartGroups: this.transcriptPartGroups
    }
  }
}