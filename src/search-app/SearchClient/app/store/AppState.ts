import { observable } from 'mobx';

export class AppState {

  constructor() {
    const query = new URLSearchParams(window.location.search);

    let view = query.get('view') ?? 'search';
    if (view === 'glossary')
      this.currentPageType = PageTypes.Glossary;
    else
      this.currentPageType = PageTypes.Search;
  }
  
  @observable public currentPageType: PageTypes;
  
  changePage(newPage: PageTypes) {
    this.currentPageType = newPage;

    const { protocol, pathname, host } = window.location;
    let newSearch = '';
    if (this.currentPageType === PageTypes.Glossary)
      newSearch = '?view=glossary'
          
    const newUrl = protocol + '//' + host + pathname + newSearch;
    window.history.pushState({}, '', newUrl);
  }
}

export enum PageTypes {
  Search,
  Glossary
}