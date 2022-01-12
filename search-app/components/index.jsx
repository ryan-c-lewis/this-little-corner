import { gql, useQuery } from '@apollo/client'
import { HitsList } from './searchkit/hits'
import { useSearchkitVariables } from '@searchkit/client'
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters,
  SortingSelector
} from '@searchkit/elastic-ui'

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiButtonGroup,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui'
import { useEffect } from 'react'

const GetResultsTitle = (data) => {
  if (data == null)
    return "";
  
  if (data?.results.summary.query !== "")
    return "Found " + data.results.summary.total + " videos that discuss \"" + data.results.summary.query + "\"";
  else
    return data?.results.summary.total + " videos to search through";
}

const query = gql`
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on DateRangeSelectedFilter {
            dateMin
            dateMax
          }

          ... on NumericRangeSelectedFilter {
            min
            max
          }

          ... on ValueSelectedFilter {
            value
          }
        }
        sortOptions {
          id
          label
        }
        query
      }
      hits(page: $page, sortBy: $sortBy) {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
        sortedBy
        items {
          ... on ResultHit {
            id
            fields {
              video_id
              channel_id
              channel_name
              title
              url
              description
              date
              transcript_parts {
                text
                start
                duration
              }
            }
          }
        }
      }
      facets {
        identifier
        type
        label
        display
        entries {
          label
          count
        }
      }
    }
  }
`

const Page = () => {
  const variables = useSearchkitVariables()
  const { previousData, data = previousData, loading } = useQuery(query, {
    variables: variables
  })

  const Facets = FacetsList([])
  return (
    <EuiPage>
      <EuiPageBody component="div">
        <EuiFlexGroup>
          <EuiFlexItem grow={1}>
            <EuiTitle size="l">
              <h2>THIS LITTLE CORNER OF THE INTERNET</h2>
            </EuiTitle>
            <div style={{"paddingBottom": 20}}>Search through youtube transcripts to find things that people have discussed.<br/>The relevant parts of the transcript will show on the right side.<br/>Click on parts of the transcript to jump to that moment in the video.</div>
            <SearchBar loading={loading} />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.results} loading={loading} />
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{GetResultsTitle(data)}</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
            <EuiPageContentHeaderSection>
              <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                  <SortingSelector data={data?.results} loading={loading} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={data} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}

export default Page
