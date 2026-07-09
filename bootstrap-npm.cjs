#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const frontendDir = __dirname;
const packageJsonPath = path.join(frontendDir, 'package.json');

console.log('🚀 Bootstrapping project dependencies...\n');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  console.log('📦 Installing dependencies manually...\n');

  // Install each dependency individually
  const depsToInstall = Object.keys(deps).slice(0, 5).map(name => `${name}@${deps[name]}`);
  
  for (const dep of depsToInstall) {
    console.log(`Installing ${dep}...`);
    try {
      execSync(`npm install ${dep}`, { 
        stdio: 'pipe',
        cwd: frontendDir,
        shell: true,
        timeout: 60000
      });
      console.log(`✓ ${dep} installed`);
    } catch (err) {
      console.warn(`⚠ Warning installing ${dep}: ${err.message.split('\n')[0]}`);
    }
  }

  console.log('\n✅ Manual bootstrap complete!');
  console.log('Run: npm install    (for full install)');
  console.log('Run: npm run dev    (to start dev server)');
} catch (err) {
  console.error('❌ Bootstrap failed:', err.message);
  process.exit(1);
}
