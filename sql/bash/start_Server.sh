docker run -e 'HOMEBREW_NO_ENV_FILTERING=4' -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password$1234' -p 1433:1433 --name=my-mssql-server -d microsoft/mssql-server-linux
