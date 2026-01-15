export function v4(): string {
  // Prefer built-in crypto UUID when available.
  // In Jest/JSDOM this typically exists via Node's webcrypto.
  const c: Crypto | undefined = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (c && 'randomUUID' in c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }

  // Minimal fallback (RFC4122 v4-ish) for environments without crypto.randomUUID.
  // Good enough for tests that only require "some id".
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

