import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import type { Subprocess } from 'bun';

const TEST_API_PORT = '3100';
const API_URL = `http://localhost:${TEST_API_PORT}/api/v1`;
let authToken = '';
const testUser = {
  username: 'admin',
  password: 'Admin123!',
};

let createdTaskId = '';
let backendProcess: Subprocess;

beforeAll(async () => {
  // Build backend first, then run compiled output for deterministic test startup
  const buildResult = Bun.spawnSync(
    ['bun', 'run', '--filter', '@ops-forge/backend', 'build'],
    {
      cwd: process.cwd(),
      stdout: 'inherit',
      stderr: 'inherit',
    },
  );
  if (buildResult.exitCode !== 0) {
    throw new Error('Backend build failed before integration tests.');
  }

  backendProcess = Bun.spawn(['node', 'apps/backend/dist/main.js'], {
    cwd: process.cwd(),
    stdout: 'ignore',
    stderr: 'inherit',
    env: {
      ...process.env,
      API_PORT: TEST_API_PORT,
      NODE_ENV: 'test',
    },
  });

  // Wait for the backend to be ready by polling
  let isUp = false;
  for (let i = 0; i < 60; i++) {
    try {
      // If we get a 401 Unauthorized for tasks without a token, the server is up and routing
      const res = await fetch(`${API_URL}/tasks`);
      if (res.status === 401 || res.status === 200) {
        isUp = true;
        break;
      }
    } catch (_) {
      // Connection refused, server not up yet
    }
    await Bun.sleep(500);
  }

  if (!isUp) {
    backendProcess.kill();
    throw new Error('Backend failed to start in time for tests.');
  }
});

afterAll(() => {
  // Kill the backend process after tests finish
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
});

describe('Ops-Forge API Integration', () => {
  it('should authenticate user and return JWT', async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('access_token');
    expect(data.user).toHaveProperty('id');
    expect(data.user.username).toBe(testUser.username);

    authToken = data.access_token;
  });

  it('should fetch tasks successfully', async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should create a new task', async () => {
    const newTask = {
      title: 'Integration Test Task',
      description: 'Created by bun:test',
      status: 'pending',
      priority: 'high',
      due_date: new Date().toISOString(),
    };

    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(newTask),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe(newTask.title);
    expect(data.status).toBe('pending');

    createdTaskId = data.id;
  });

  it('should update the created task', async () => {
    const updateData = {
      status: 'in_progress',
    };

    const res = await fetch(`${API_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updateData),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(createdTaskId);
    expect(data.status).toBe('in_progress');
  });

  it('should delete the created task', async () => {
    const res = await fetch(`${API_URL}/tasks/${createdTaskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(204);

    // Verify it is gone
    const verifyRes = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const remainingTasks = await verifyRes.json();
    const found = remainingTasks.find((t: any) => t.id === createdTaskId);
    expect(found).toBeUndefined();
  });
});
