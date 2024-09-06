To maintain this site as it currently is, you would need:

1. A dedicated Windows machine (sorry; this thing could be trivially ported to Linux if you convert it to .NET Core)
2. Set up Elastic Search
3. Run build-for-prod.ps1 which will zip up everything
4. Dump the zip on the host machine and start up the server. It's a lightweight thing, don't need to install anything extra as long as the host machine can run .NET
5. Daily run the program also from your PERSONAL machine so you can scrape the YouTube transcripts without YouTube blocking you for being a bot. You can't run this part from AWS, for example. I haven't found a way to automate it.

That's pretty much it.