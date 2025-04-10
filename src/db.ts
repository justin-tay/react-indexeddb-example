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

interface User {
  id: string; // user.id
  publicKey: ArrayBuffer;
  credential: PublicKeyCredential;
}

const db = new Dexie('EncryptionKeyDatabase') as Dexie & {
  keys: EntityTable<
    EncryptionKey,
    'id' // primary key "id" (for the typings only)
  >,
  counter: EntityTable<Counter, 'id'>,
  handle: EntityTable<Handle, 'id'>,
  users: EntityTable<User, 'id'>
};

// Schema declaration:
db.version(1).stores({
  keys: '++id, key',
  counter: '++id, counter',
  handle: '++id',
  users: 'id'
});

export type { EncryptionKey, Counter };
export { db };