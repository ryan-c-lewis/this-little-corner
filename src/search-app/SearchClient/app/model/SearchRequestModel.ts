export class SearchRequestModel {
  query: string = "";
  sort: string = "relevant";
  channel: string = "all";
  page: number = 0;
  pageSize: number = 10;

  public constructor(init?:Partial<SearchRequestModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      query: this.query,
      sort: this.sort,
      channel: this.channel,
      page: this.page,
      pageSize: this.pageSize
    }
  }
}