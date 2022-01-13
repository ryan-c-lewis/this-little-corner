import {TranscriptPartModel} from "./TranscriptPartModel";

export class TranscriptPartGroupModel {
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