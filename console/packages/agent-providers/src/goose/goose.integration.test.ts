import { spawnSync } from 'node:child_process';
import { describeConformance, echoMcpServerSpec } from '../testing/index';
import { createGooseAdapter } from './goose-adapter';

describeConformance('goose', {
  createAdapter: async () => createGooseAdapter(),
  unavailableReason: async () => {
    const probe = spawnSync('goose', ['acp', '--help'], { encoding: 'utf8' });
    return probe.error || probe.status !== 0 ? 'the Goose ACP binary is not available' : null;
  },
  skip: {
    'user-input': 'Goose does not implement user-input questions over ACP.',
    subagents: 'Goose delegates through extensions rather than native ACP subagent items.',
  },
  mcpServers: { echo: echoMcpServerSpec() },
  ...(process.env.GOOSE_PROVIDER ? { env: { GOOSE_PROVIDER: process.env.GOOSE_PROVIDER } } : {}),
  ...(process.env.GOOSE_MODEL ? { env: { GOOSE_MODEL: process.env.GOOSE_MODEL } } : {}),
});
