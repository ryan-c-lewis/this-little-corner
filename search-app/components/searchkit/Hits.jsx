import React from 'react'
import { EuiFlexGrid, EuiFlexItem, EuiCard, EuiFlexGroup, EuiTitle, EuiText } from '@elastic/eui'

export const HitsList = ({ data }) => (
  <>
    {data?.results.hits.items.map((hit) => (
      <EuiFlexGroup gutterSize="xl" key={hit.id}>
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={4}>
              <EuiTitle size="xs">
                <div>
                  <a href={hit.fields.url}><h4>{hit.fields.title}</h4></a>
                  <h6>{hit.fields.date}</h6>
                </div>
              </EuiTitle>
              <EuiFlexGroup>
                <EuiFlexItem grow={4}>
                  <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + hit.fields.id}
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                </EuiFlexItem>
                <EuiFlexItem grow={4}>
                  <div style={{'max-height': 315, 'overflow-y': 'auto'}}>
                    <span>{hit.fields.description} </span>
                    {hit.fields.transcript_parts.map((part) => (
                        <a href={hit.fields.url + "#t=" + part.start + "s"}><span>{part.text} </span></a>
                    ))}
                  </div>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    ))}
  </>
)
