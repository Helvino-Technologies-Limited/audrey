import { neon } from '@neondatabase/serverless';

// Returns a fresh neon client each call — safe for serverless/HTTP-based Neon
// and avoids module-level instantiation that breaks at build time.
function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const db = neon(process.env.DATABASE_URL!);
  return db(strings, ...values);
}

export default sql;
