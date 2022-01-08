// lib/withApollo.js
import withApollo from 'next-with-apollo';
import { InMemoryCache, ApolloProvider, ApolloClient } from '@apollo/client'
import { Helmet } from 'react-helmet'

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: 'https://this-little-corner-searcher.ngrok.io/api/graphql',
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {

        function postMessageToPlayer(iframe, func, args) {
            iframe.contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': func,
                'args': args || []
            }), '*');
        }
        function pauseAllExcept(iframeToIgnore) {
            var i, frames;
            frames = document.getElementsByTagName("iframe");
            for (i = 0; i < frames.length; ++i) {
                if (frames[i] === iframeToIgnore)
                    continue;
                postMessageToPlayer(frames[i], "pauseVideo", []);
            }
        }
        function jump(id, time) {
            let iframe = document.getElementById(id);
            pauseAllExcept(iframe);
            postMessageToPlayer(iframe, "seekTo", [time, true]);
            postMessageToPlayer(iframe, "playVideo", []);
        }
        function setupCallPlayer() {
            window['jump'] = jump;
        }
        
      return (
        <div>
            <Helmet>
                <title>This Little Corner Searcher</title>
                <script src="https://www.youtube.com/player_api"></script>
            </Helmet>
            <ApolloProvider client={props.apollo}>
              <Page {...props} />
            </ApolloProvider>
            {setupCallPlayer()}
        </div>
      );
    }
  }
);