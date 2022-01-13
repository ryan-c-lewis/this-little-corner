export class SearchRequestModel {
  query: string = "";
  currentPage: number = 0;
  pageSize: number = 10;

  public constructor(init?:Partial<SearchRequestModel>) {
    Object.assign(this, init);
  }

  public toJs(): any {
    return {
      query: this.query,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    }
  }
}