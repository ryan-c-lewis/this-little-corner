$scriptpath = $MyInvocation.MyCommand.Path | Split-Path
Push-Location $scriptpath

Push-Location SearchClient
$packageJson = Get-Content 'package.json' | ConvertFrom-Json
$version = [version]$packageJson.version
$bumpedVersion = [version]::new($version.Major, $version.Minor, $Version.Build + 1).ToString()
$packageJson.version = $bumpedVersion
ConvertTo-Json $packageJson | Set-Content 'package.json'
Write-Host "$version -> $bumpedVersion"
Remove-Item -Recurse -Force dist

yarn
yarn prod

Push-Location ..
dotnet restore SearchServer/SearchServer.csproj
dotnet build SearchServer/SearchServer.csproj --configuration=Release

Remove-Item -Recurse -Force out
New-Item -Path out -ItemType Directory
New-Item -Path out/dist -ItemType Directory

Copy-Item SearchClient/dist/* out/dist -Recurse -Force -Exclude *.map
Copy-Item SearchClient/public/* out/dist -Recurse -Force
Copy-Item SearchServer/bin/Release/net6.0/* out -Recurse -Force

Compress-Archive -Path out/* -DestinationPath "v$bumpedVersion.zip"