export class SearchRequestModel {
  query: string = "";
  page: number = 0;
  pageSize: number = 10;

  public constructor(init?:Partial<SearchRequestModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      query: this.query,
      page: this.page,
      pageSize: this.pageSize
    }
  }
}