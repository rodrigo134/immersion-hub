import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
} from '../types/auth'

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || '';

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async resolveErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
      const data = (await response.json()) as { message?: string }
      if (data?.message) return data.message
      return fallback
    } catch {
      const message = await response.text()
      return message || fallback
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const message = await this.resolveErrorMessage(response, 'Login failed')
      throw new Error(message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const message = await this.resolveErrorMessage(response, 'Registration failed')
      throw new Error(message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await this.resolveErrorMessage(response, 'Failed to generate reset token')
      throw new Error(message)
    }

    return (await response.json()) as ForgotPasswordResponse
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await this.resolveErrorMessage(response, 'Failed to reset password')
      throw new Error(message)
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }
}

export const authService = new AuthService();
