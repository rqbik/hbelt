import { promises as pfs } from 'fs';

const CACHE_FILE = '/belt.json';

export type CachedAccount = {
  email: string;
  name: string;
  id: string;
  password: string;
};

type Cache = CachedAccount[];

export const getOrCreateCache = async (cacheDir: string): Promise<Cache> =>
  pfs
    .readFile(`${cacheDir}${CACHE_FILE}`)
    .then((file) => JSON.parse(file.toString()))
    .catch(async () => {
      await pfs.writeFile(`${cacheDir}${CACHE_FILE}`, '[]');
      return [];
    });

export const writeCache = async (
  cacheDir: string,
  cache: Cache
): Promise<void> =>
  pfs.writeFile(`${cacheDir}${CACHE_FILE}`, JSON.stringify(cache));
