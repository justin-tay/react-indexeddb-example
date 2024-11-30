import Dexie, { type EntityTable } from 'dexie';

interface EncryptionKey {
  id: number;
  key: CryptoKey;
}

const db = new Dexie('EncryptionKeyDatabase') as Dexie & {
  keys: EntityTable<
    EncryptionKey,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  keys: '++id, key'
});

export type { EncryptionKey };
export { db };