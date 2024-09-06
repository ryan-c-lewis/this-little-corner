using System.Collections.Generic;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class ChannelsRequestHandler
    {
        public List<Channel> GetChannels()
        {
            return new List<Channel>
            {
                new Channel("UCCebR16tXbv5Ykk9_WtCCug", "Agapologia", new [] {"agapologia", "golden"}),
                new Channel("UC6vg0HkKKlgsWk-3HfV-vnw", "A Quality Existence", new [] {"quality", "existence"}),
                new Channel("UCeWWxwzgLYUbfjWowXhVdYw", "Andrea with the Bangs", new [] {"andrea", "bangs"}),
                new Channel("UC952hDf_C4nYJdqwK7VzTxA", "Charlie's Little Corner", new []{"charlie", "charlie's"}),
                new Channel("UCU5SNBfTo4umhjYz6M0Jsmg", "Christian Baxter", new [] {"christian", "baxter"}),
                new Channel("UC6Tvr9mBXNaAxLGRA_sUSRA", "Colton Kirby", new [] {"colton", "kirby"}),
                new Channel("UC4Rmxg7saTfwIpvq3QEzylQ", "Ein Sof: Infinite Reflections", new []{"ein", "sof", "infinite", "reflections", "yosef"}),
                new Channel("UCTdH4nh6JTcfKUAWvmnPoIQ", "Eric Seitz", new []{"eric", "seitz"}),
                new Channel("UCsi_x8c12NW9FR7LL01QXKA", "Grail Country", new [] {"grail", "country"}),
                new Channel("UCAqTQ5yLHHH44XWwWXLkvHQ", "Grizwald Grim", new [] {"griz", "grim"}),
                new Channel("UCprytROeCztMOMe8plyJRMg", "Jacob Faturechi", new [] {"jacob", "faturechi"}),
                new Channel("UCpqDUjTsof-kTNpnyWper_Q", "John Vervaeke", new [] {"john", "vervaeke", "jvv"}),
                new Channel("UCL_f53ZEJxp8TtlOkHwMV9Q", "Jordan Peterson", new [] {"jordan", "peterson", "jbp"}),
                new Channel("UCez1fzMRGctojfis2lfRYug", "Lucas Vos", new []{"lucas", "vos"}),
                new Channel("UC2leFZRD0ZlQDQxpR2Zd8oA", "Mary Kochan", new [] {"mary", "kochan"}),
                new Channel("UC8SErJkYnDsYGh1HxoZkl-g", "Michael Sartori", new [] {"michale", "sartori"}),
                new Channel("UCEPOn4cgvrrerg_-q_Ygw1A", "More Christ", new [] {"more", "christ"}),
                new Channel("UC2yCyOMUeem-cYwliC-tLJg", "Paul Anleitner", new [] {"anleitner"}),
                new Channel("UCGsDIP_K6J6VSTqlq-9IPlg", "Paul Vander Klay", new [] {"paul", "van", "pvk"}),
                new Channel("UCEzWTLDYmL8soRdQec9Fsjw", "Randos United (original)", new [] {"randos", "united"}),
                new Channel("UC1KgNsMdRoIA_njVmaDdHgA", "Randos United (new)", new [] {"randos", "united"}),
                new Channel("UCFQ6Gptuq-sLflbJ4YY3Umw", "Rebel Wisdom", new [] {"rebel", "wisdom"}),
                new Channel("UCEY1vGNBPsC3dCatZyK3Jkw", "Strange Theology", new [] {"strange", "theology", "pete"}),
                new Channel("UCIAtCuzdvgNJvSYILnHtdWA", "The Andromist", new [] {"andromist"}),
                new Channel("UClIDP7_Kzv_7tDQjTv9EhrA", "The Chris Show", new [] {"chris", "show"}),
                new Channel("UC-QiBn6GsM3JZJAeAQpaGAA", "The Common Toad", new [] {"common", "toad"}),
                new Channel("UCiJmdXTb76i8eIPXdJyf8ZQ", "The Friday Morning Nameless", new [] {"friday", "morning", "nameless"}),
                new Channel("UCM9Z05vuQhMEwsV03u6DrLA", "The Information Addict", new [] {"information", "addict"}),
                new Channel("UCgp_r6WlBwDSJrP43Mz07GQ", "The Meaning Code", new [] {"meaning", "code", "karen", "wong"}),
                new Channel("UC5uv-BxzCrN93B_5qbOdRWw", "The Scrollers Podcast", new [] {"scrollers", "matt"}),
                new Channel("UCtCTSf3UwRU14nYWr_xm-dQ", "The Symbolic World", new [] {"jonathan", "pageau", "symbolic", "world"}),
                new Channel("UC1a4VtU_SMSfdRiwMJR33YQ", "The Young Levite", new [] {"young", "levite", "chezi"}),
                new Channel("UCg7Ed0lecvko58ibuX1XHng", "Transfigured", new [] {"transfigured", "sam"}),
            };
        }
    }
}