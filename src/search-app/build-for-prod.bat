cd SearchClient
yarn|rem
yarn prod|rem
cd ..
dotnet restore SearchServer/SearchServer.csproj|rem
dotnet build SearchServer/SearchServer.csproj --configuration=Release|rem

rmdir /s /q out
mkdir out
mkdir out\dist
xcopy /s /y /exclude:files-to-exclude.txt "SearchClient\dist" out\dist
xcopy /s /y "SearchServer\bin\Release\net6.0" out