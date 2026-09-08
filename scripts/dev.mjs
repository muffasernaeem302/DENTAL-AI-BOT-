import { spawn } from 'node:child_process'

const isWindows = process.platform === 'win32'
const command = isWindows ? 'npm.cmd' : 'npm'
const children = [
  spawn('python', ['-m', 'uvicorn', 'main:app', '--reload', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: 'backend',
    stdio: 'inherit',
  }),
  spawn(command, ['--prefix', 'frontend', 'run', 'dev', '--', '--host', '127.0.0.1'], {
    stdio: 'inherit',
    shell: isWindows,
  }),
]

function stopChildren() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
}

process.on('SIGINT', stopChildren)
process.on('SIGTERM', stopChildren)
children.forEach((child) => child.on('exit', (code) => {
  if (code && code !== 0) process.exitCode = code
}))
