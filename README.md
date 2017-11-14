# Fortis Insight Dashboard

[![CI status](https://travis-ci.org/CatalystCode/project-fortis-interfaces.svg?branch=master)](https://travis-ci.org/CatalystCode/project-fortis-interfaces)

An Early Warning Humanitarian Crisis Detection Platform

## Preview

[![Preview](https://cloud.githubusercontent.com/assets/7635865/22437397/c57eb276-e6dc-11e6-8fc4-7fdb332aae50.png)](https://cloud.githubusercontent.com/assets/7635865/22437397/c57eb276-e6dc-11e6-8fc4-7fdb332aae50.png)
[![Preview](https://cloud.githubusercontent.com/assets/7635865/22437264/42602c94-e6dc-11e6-8f52-21ed96b84ea8.png)](https://cloud.githubusercontent.com/assets/7635865/22437264/42602c94-e6dc-11e6-8f52-21ed96b84ea8.png)


# Development Steps for Interfaces & Services Projects

The following helps in setting up a stand-alone environment that runs an instance of Cassandra (in Docker) along with the Interfaces (UI) and the Services (API) projects.

## Setup

Create a local workspsace in a fresh directory, then do a `git clone` of three projects.

> Note: Visual Studio Code now supports Project Workpsaces; I strongly suggest utilizing.

### Fork and Clone projects
Preferably, you will fork the projects into your own identity/repository and perform all development folloiwng basic GitHub Flow - which all updates are via Pull Requests back to the primary Repository.


| Project | Path |
|--|--|
| Interfaces | https://github.com/CatalystCode/project-fortis-interfaces.git |
| Services | https://github.com/CatalystCode/project-fortis-services.git |
| Cassandra | https://github.com/cicorias/cassandra-cqlsh |

> Note: The Cassandra project already has scripts for seeding Settings data, and will run on Docker Compose.

> Note: The following steps illustrate *NOT Forking* of the source repopsitory.  Again, follow GitHub flow for proper updates. This is fine for just getting up and running.

```
#first make some root path, then clone each project

mkdir fortisdev
cd fortisdev
git clone https://github.com/CatalystCode/project-fortis-interfaces.git

git clone https://github.com/CatalystCode/project-fortis-services.git

git clone https://github.com/cicorias/cassandra

```

### Startup Cassandra
Cassandra will startup and expose ports to the host machine where Docker is running. This has been validated with:
- Docker version 17.09.0-ce, build afdb6d4
- docker-compose version 1.16.1, build 6d1ac21

```
# you should already be in the fortisdev directory which will have 3 child folders
pwd  #should say fortisdev or what you created before
cd cassandra
docker-compose up

```

At this point, wait till you see the Docker Cassandra Seed Data script finish.  The following should appear when Cassandra is running, keyspaces created, and seed data initialized:

```
cassandra-init_1    | FINISHED ADDING TERMS TO THE WATCHLIST
cassandra_cassandra-init_1 exited with code 0
```

### Startup Fortis Services
Fortis services has a direct dependency on Cassandra. The Cassandra instance used in Docker utilizes no username or password (don't use this in production).

#### Review or Create an `.env` file

The project makes use of the `dotenv` package from [Dotenv on NPM](https://www.npmjs.com/package/dotenv).  

This package provides the ability to inject Operating Environment variables from both files and actual Environment variables.  This has been added to this project as Create-React-App package also leverages the same package for Enviroment variable management.


##### `.env` file for Development

Some values cannot be published here and are secrets. Generally, `.env` files should NOT be commited to public repositories.

> Note: the Cassandra username and password below are blank for this local use.

```
PUBLISH_EVENTS_EVENTHUB_CONNECTION_STRING=
PUBLISH_EVENTS_EVENTHUB_PATH="customevents"
PUBLISH_EVENTS_EVENTHUB_PARTITION="$Default"
EBOOK_AUTH_TOKEN="A SECRET"
#FORTIS_FEATURE_SERVICE_HOST="..."
APPINSIGHTS_INSTRUMENTATIONKEY="SOME GUID
CASSANDRA_KEYSPACE="fortis"
CASSANDRA_CONTACT_POINTS="127.0.0.1"
CASSANDRA_USERNAME=""
CASSANDRA_PASSWORD=""
ENABLE_V2="true"
FORTIS_SB_CONN_STR="Endpoint=sb://SERVICE.servicebus.windows.net/;SharedAccessKeyName=SOME SAS TOKEN"
FORTIS_SB_CONFIG_QUEUE="configuration"                                   
FORTIS_SB_COMMAND_QUEUE="command"
TRANSLATION_SERVICE_ACCOUNT_KEY="ANOTHER SECRET"

DEBUG=fortis:*

```

#### Startup Services
One the `.env` file is present, you can run the project in normal start mode or with nodemon.

```
npm start
## or if you want to use nodemon
npm run nodemon
```


### Startup Fortis Interfaces
Fortis Interfaces depends upon Services.

#### Review or Create an `.env` file

The project is based upon the scaffolding and scripts from `create-react-app` package from [Create Reac App on NPM](https://www.npmjs.com/package/create-react-app). This package makes use of the `dotenv` package from [Dotenv on NPM](https://www.npmjs.com/package/dotenv).  

This package provides the ability to inject Operating Environment variables from both files and actual Environment variables.  

> Note: Review Environment variable handling from the tool's GitHub readme [Environment Variables](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables)


##### `.env` file for Development

```
REACT_APP_SERVICE_HOST=http://localhost:8000
REACT_APP_FEATURE_SERVICE_HOST=http://GET.THE.REAL.IP

```

#### Startup Interfaces

```
npm start
```

At this point, this will start the UI in the default browser, or if on macOS, if Chrome is open, it will open the base URL in a new Tab in Chrome.

## Change the URL
The seed data creates a Site Settings entry for a site called `America`.

Ensure that the URL is now: http://localhost:3000/#/site/America
### Launch site / Update Opened URL

http://localhost:3000/#/site/America

If you've setup other sites, open [http://localhost:3000/#/site/{ENTER_YOUR_SITE_NAME}/](http://localhost:3000/#/site/{ENTER_YOUR_SITE_NAME}/) to view your fortis site in the browser.

The page will reload if you make edits. You will see the build errors and lint warnings in the console.


## Production setup

Build production asset bundle

```sh
npm run build
```

Host locally

```sh
npm install -g pushstate-server
pushstate-server build
```
