import { useState } from 'react'
import { KeyRound, Mail } from 'lucide-react'
import { authService } from '../../services/authService'

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void
  onGoToReset: () => void
}

export function ForgotPasswordForm({
  onSwitchToLogin,
  onGoToReset,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await authService.forgotPassword({ email })
      setMessage(result.message)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate reset token'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/85 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">Forgot password</h2>
          <p className="mt-2 text-slate-300">Enter your account email to receive reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-10 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onGoToReset}
            className="mb-3 block w-full text-sm font-semibold text-amber-300 transition hover:text-amber-200"
          >
            I already have a token
          </button>
          <button
            onClick={onSwitchToLogin}
            className="text-sm font-semibold text-amber-300 transition hover:text-amber-200"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}
