// Storage contract — stub until a storage-* extension is injected.
// Inject storage-supabase or storage-s3 to replace these with real implementations.

export async function upload(
  _path: string,
  _file: Buffer | Blob,
  _options?: { contentType?: string; upsert?: boolean }
): Promise<string> {
  throw new Error(
    'No storage extension injected. Run: pnpm inject storage-supabase saas-starter'
  );
}

export async function getUrl(_path: string): Promise<string> {
  throw new Error(
    'No storage extension injected. Run: pnpm inject storage-supabase saas-starter'
  );
}

export async function remove(_path: string): Promise<void> {
  throw new Error(
    'No storage extension injected. Run: pnpm inject storage-supabase saas-starter'
  );
}
