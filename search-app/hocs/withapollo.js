// lib/withApollo.js
import withApollo from 'next-with-apollo';
import {InMemoryCache, ApolloProvider, ApolloClient, ApolloLink, HttpLink} from '@apollo/client'
import { Helmet } from 'react-helmet'

const uri = 'http://this-little-corner.com/api/graphql'

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: uri,
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
            if (typeof window === 'undefined')
                return;
            window['jump'] = jump;
        }
        function setupGoogleAnalytics() {
            if (typeof window === 'undefined')
                return;
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4NMG9ZPKXT');
        }
        
      return (
        <div>
            <Helmet>
                <title>This Little Corner Searcher</title>
                <script src="https://www.youtube.com/player_api"></script>
                <script async src="http://www.googletagmanager.com/gtag/js?id=G-4NMG9ZPKXT"></script>
                {setupGoogleAnalytics()}
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