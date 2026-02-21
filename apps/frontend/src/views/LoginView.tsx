import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ username, password });
      setAuth(res.access_token, res.user);
      navigate('/tasks', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-login-gradient pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-7 w-full max-w-[420px]">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-gradient-accent-120 rounded-[10px] flex items-center justify-center">
              <span className="text-text-secondary font-bold text-base">O</span>
            </div>
            <span className="text-text-secondary font-bold text-[26px]">
              Ops-Forge
            </span>
          </div>
          <span className="text-text-muted text-[13px] font-medium">
            Internal Technical Workflow Suite
          </span>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-surface-700 rounded-card border border-surface-600 shadow-card-login p-7 flex flex-col gap-[18px]"
        >
          {/* Card Header */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-text-primary text-2xl font-bold">Sign in</h1>
            <p className="text-text-muted text-[13px]">
              Access Ops-Forge for your team workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-priority-high-bg/50 border border-priority-high-text/20 rounded-input px-3 py-2.5 text-priority-high-text text-[13px]">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              className="text-text-label text-xs font-semibold"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full h-11 bg-surface-900 rounded-input border border-surface-600 px-3 text-[13px] font-medium text-text-secondary placeholder:text-text-placeholder outline-none focus:border-accent-blue transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              className="text-text-label text-xs font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 bg-surface-900 rounded-input border border-surface-600 px-3 text-base font-medium text-text-secondary placeholder:text-text-placeholder outline-none focus:border-accent-blue transition-colors"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] bg-gradient-accent rounded-input flex items-center justify-center text-text-primary text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
