import { spawn } from 'child_process';

// Start Next.js dev server
const port = process.env.PORT || '5000';

console.log(`Starting Next.js on port ${port}...`);

const nextDev = spawn('npx', ['next', 'dev', '-p', port], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

nextDev.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Next.js exited with code ${code}`);
    process.exit(code || 1);
  }
});
