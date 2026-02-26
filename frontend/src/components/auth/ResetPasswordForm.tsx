import { useState } from 'react'
import { Eye, EyeOff, KeySquare } from 'lucide-react'
import { authService } from '../../services/authService'

interface ResetPasswordFormProps {
  initialToken?: string
  onSwitchToLogin: () => void
}

export function ResetPasswordForm({ initialToken = '', onSwitchToLogin }: ResetPasswordFormProps) {
  const [token, setToken] = useState(initialToken)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await authService.resetPassword({ token, newPassword: password })
      setSuccess('Password reset successfully. You can sign in now.')
      setPassword('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/85 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/30">
            <KeySquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">Reset password</h2>
          <p className="mt-2 text-slate-300">Paste your reset token and define a new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="token" className="mb-2 block text-sm font-semibold text-slate-200">
              Reset token
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              placeholder="Paste token here"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-200">
              New password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-sm font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}
