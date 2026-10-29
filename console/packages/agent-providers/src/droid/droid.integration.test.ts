import { spawnSync } from 'node:child_process';
import { describeConformance, echoMcpServerSpec } from '../testing/index';
import { createDroidAdapter, droidAcp } from './droid-adapter';

describeConformance('droid', {
  createAdapter: async () => createDroidAdapter(),
  unavailableReason: async () => {
    const probe = spawnSync('droid', ['--version'], { encoding: 'utf8' });
    if (probe.error || probe.status !== 0) {
      return 'the droid binary is not on PATH';
    }
    const readiness = await droidAcp.checkSignIn?.({
      binaryPath: 'droid',
      cwd: process.cwd(),
      env: process.env as Record<string, string>,
      handshake: async () => ({}),
    });
    if (readiness && readiness.status !== 'authenticated') {
      return `Factory Droid is not signed in (${readiness.message})`;
    }
    return null;
  },
  mcpServers: { echo: echoMcpServerSpec() },
  ...(process.env.FACTORY_API_KEY ? { env: { FACTORY_API_KEY: process.env.FACTORY_API_KEY } } : {}),
});
