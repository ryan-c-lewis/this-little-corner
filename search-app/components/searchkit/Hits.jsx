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
                  <h6>{hit.fields.channel_name}</h6>
                  <h6>{hit.fields.date}</h6>
                </div>
              </EuiTitle>
              <EuiFlexGroup>
                <EuiFlexItem grow={4}>
                  <iframe id={"video_" + hit.fields.video_id} width="560" height="315" src={"https://www.youtube.com/embed/" + hit.fields.video_id + "?enablejsapi=1"}
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                </EuiFlexItem>
                <EuiFlexItem grow={4}>
                  <div style={{'maxHeight': 315, 'overflowY': 'auto'}}>
                    <span>{hit.fields.description} </span>
                    {hit.fields.transcript_parts.map((part) => (
                        <a href={"javascript:jump('video_" + hit.fields.video_id + "', " + part.start + ");"} key={part.start}><span>{part.text} </span></a>
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
