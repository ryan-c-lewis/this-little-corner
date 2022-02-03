import {TranscriptPartModel} from "./TranscriptPartModel";
import {observable} from "mobx";

export class TranscriptPartGroupModel {
  @observable
  transcriptParts: TranscriptPartModel[];

  public constructor(init?:Partial<TranscriptPartGroupModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      transcriptParts: this.transcriptParts
    }
  }
}