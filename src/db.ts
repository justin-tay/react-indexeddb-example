import Dexie, { type EntityTable } from 'dexie';

interface EncryptionKey {
  id: number;
  key: CryptoKey;
}

interface Counter {
  id: number;
  counter: number;
}

interface Handle {
  id: number;
  handle: any;
}

const db = new Dexie('EncryptionKeyDatabase') as Dexie & {
  keys: EntityTable<
    EncryptionKey,
    'id' // primary key "id" (for the typings only)
  >,
  counter: EntityTable<Counter, 'id'>,
  handle: EntityTable<Handle, 'id'>
};

// Schema declaration:
db.version(1).stores({
  keys: '++id, key',
  counter: '++id, counter',
  handle: '++id'
});

export type { EncryptionKey, Counter };
export { db };