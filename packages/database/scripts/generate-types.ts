import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

/**
 * Generates TypeScript types from the database schema using kysely-codegen.
 * Output is written to packages/shared-types/src/db.generated.ts
 */
const outputPath = resolve(__dirname, '../../shared-types/src/db.generated.ts');

console.log('🔍 Introspecting database schema...');
console.log(`📝 Output: ${outputPath}`);

try {
  execSync(
    `bunx --bun kysely-codegen --out-file "${outputPath}" --dialect postgres`,
    {
      stdio: 'inherit',
      env: { ...process.env },
    },
  );
  // Normalize generated output to repository formatting conventions.
  execSync(`bunx --bun @biomejs/biome format --write "${outputPath}"`, {
    stdio: 'inherit',
    env: { ...process.env },
  });
  console.log('✅ Types generated successfully!');
} catch (error) {
  console.error('❌ Type generation failed:', error);
  process.exit(1);
}
