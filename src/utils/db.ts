type GetDbURIArgs = {
  username: string,
  password: string,
  host: string,
  port?: number,
  databaseName: string
}

export function getDbURI({
  username,
  password,
  host,
  port=27017,
  databaseName
}: GetDbURIArgs): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
}
