## Overview

Given a url, takes a snapshot of the content initially but will let you know when something has changed

There will also be a excluder functionality where you will be able to exclude certain content from the output (for things like cookie showing etc.)

Should have the UI where you can setup as many web pages as you like
Should also have a UI where you can exclude certian text (HTML) chunks from being considered a change

## Components

- Notifer: a cron job (could be a microservice) that constantly keeps track of all watching URLs and notify the users when something changed (could be done in Go)

## UI

Pages:

- Watched URLs
- (if no watched URLs) A simple Button to say Watch a new URL and a form to register the URL

## Lambdas

- POST /register -d {url: string}
-
- Exclude chunk from URL
-

## Data model

### Normalised

Users {
userId: string (primaryKey)
userName: string;
}

WatchedURL {
userId: string (primaryKey)
url: string (sortKey)
createdDateTime: datetime;
state: "open" | "closed"
}

Snapshots {
userId: string (primaryKey)
url: string (primaryKey)
snapshot: string
}

Exclusion {
userId: string (primaryKey)
url: string (primaryKey)
exclusion: string
}

## Queries

The table design is created in a way to create the most efficient queries possible but overloading the sort key field and storing data about essentially three different entity types: URLs, Snapshots and Exclusions

By Pages
Home page:

1. Get all watched URLs by the userId (whether the user is watching any URLs)

Watched URLs

1. Get all watched URLs by the userId

Register watching new URL:

1. Add new URL for the user

Snapshots:

1. Get all snapshots by UserId and URL

Add new exclusion

1. Add new exclusion by UserId and URL

By Daemon:

1. Get all watched URLs#
2. Write new snapshot for a UserId and URL
3. Get all exclusion by UserId and URL

### Denormalised based on the queries

WatchedUrl {
userId: string (primaryKey)
sk: string (one of the folowing patterns) - URL#http:/... - snapshot#http://google.com#2021-02-09-16:26 - exclusion#http://google.com#2021-02-09-16:26
url: string;
createdDateTime: datetime;
state: "open" | "closed"
snapshot?: string;
exclusion?: string
}
