import { useState } from 'react'
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm'
import { useAuth } from '../contexts/AuthContext'
import type { LoginRequest, RegisterRequest } from '../types/auth'

export function AuthPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(
    searchParams.get('mode') === 'reset' ? 'reset' : 'login',
  )
  const resetToken = searchParams.get('token') ?? ''
  const { login, register } = useAuth()

  async function handleLogin(data: LoginRequest) {
    await login(data.username, data.password)
  }

  async function handleRegister(data: RegisterRequest) {
    await register(data.username, data.email, data.password)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <div className="hidden text-white lg:block">
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-cyan-300">Immersion Hub</p>
          <h1 className="text-5xl font-black leading-tight">
            Learn faster
            <br />
            with total immersion
          </h1>
          <p className="mt-5 max-w-md text-lg text-slate-300">
            Access your decks, study materials, transcription tools, and review sessions in one place.
          </p>
        </div>

        <div className="w-full">
          {mode === 'login' && (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setMode('register')}
              onForgotPassword={() => setMode('forgot')}
            />
          )}
          {mode === 'register' && (
            <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setMode('login')} />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setMode('login')}
              onGoToReset={() => setMode('reset')}
            />
          )}
          {mode === 'reset' && (
            <ResetPasswordForm initialToken={resetToken} onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
