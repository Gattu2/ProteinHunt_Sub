const { spawnSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const testArgs = ['playwright', 'test', ...process.argv.slice(2)];
const testRun = spawnSync(npxCmd, testArgs, {
  stdio: 'inherit',
  shell: false,
});

const exitCode = typeof testRun.status === 'number' ? testRun.status : 1;

const reportPath = path.join(process.cwd(), 'reports', 'extent-report', 'index.html');

if (isWindows) {
  // Open extent report after test execution completes (pass or fail).
  spawnSync('cmd.exe', ['/c', 'start', '', reportPath], {
    stdio: 'ignore',
    shell: false,
  });
} else {
  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawnSync(opener, [reportPath], {
    stdio: 'ignore',
    shell: false,
  });
}

process.exit(exitCode);
