import React from 'react'
import { EuiFlexGrid, EuiFlexItem, EuiCard, EuiFlexGroup, EuiTitle, EuiText } from '@elastic/eui'

export const GetMatchingPartsOfTranscript = (query, transcript_parts) => {
  if (query === '')
    return [];
  
  let lowerQuery = query.toLowerCase();
  let results = [];
  let latestMatch = -1;
  for (let n = 4; n < transcript_parts.length - 4; n++) {
    let transcript_section = transcript_parts[n].text.toLowerCase() + ' ' + transcript_parts[n + 1].text.toLowerCase() + ' ' + transcript_parts[n + 2].text.toLowerCase();
    if (transcript_section.includes(lowerQuery)) {
      latestMatch = n;
    }
    
    if (latestMatch > -1 && latestMatch !== n) {
      let thisSet = []
      thisSet.push(transcript_parts[latestMatch - 4], transcript_parts[latestMatch - 3], transcript_parts[latestMatch - 2], transcript_parts[latestMatch - 1], transcript_parts[latestMatch], transcript_parts[latestMatch + 1], transcript_parts[latestMatch + 2], transcript_parts[latestMatch + 3], transcript_parts[latestMatch + 4])
      results.push(thisSet);
      latestMatch = -1;
    }
  }
  return results;
}

export const HitsList = ({ data }) => (
  <>
    {data?.results.hits.items.map((hit) => (
      <EuiFlexGroup gutterSize="xl" key={hit.id}>
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={4}>
              <EuiTitle size="xs">
                <div>
                  <h4>{hit.fields.title}</h4>
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
                    {GetMatchingPartsOfTranscript(data?.results.summary.query, hit.fields.transcript_parts).map((set) => (
                        <div style={{'paddingBottom': 20}}>
                          {set.map((part) => (
                            <a href={"javascript:jump('video_" + hit.fields.video_id + "', " + part.start + ");"} key={part.start}><span>{part.text} </span></a>
                          ))}
                        </div>
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
