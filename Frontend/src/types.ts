export interface User {
  name: string;
}

export interface WatchedUrlDynamoTable {
  createdOn: string;
  sk: string;
  userId: number;
}

export interface DynamoDBResponse<T> {
  Items: T[];
  Count: number;
  ScannedCount: number;
}

export interface WatchedUrl {
  sk: string;
  userId: number;
  url: string;
  createdOn: string;
  snapshots?: string;
  exclusion?: string;
}
