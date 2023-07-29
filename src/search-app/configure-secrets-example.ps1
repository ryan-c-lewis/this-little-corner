#set the values and save the file as 'configure-secrets.ps1'

[System.Environment]::SetEnvironmentVariable(
    'ELASTIC_URL',
    'http://localhost.com:80/indexer',
    [System.EnvironmentVariableTarget]::Machine)
    
[System.Environment]::SetEnvironmentVariable(
    'OPENAI_API_KEY',
    '...',
    [System.EnvironmentVariableTarget]::Machine)