export interface User {
  name: string;
}

export interface WatchedUrlTable {
  sk: string;
  userId: number;
}

export interface DynamoDBResponse<T> {
  Items: T[];
  Count: number;
  ScannedCount: number;
}
