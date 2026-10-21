import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe registrar un nuevo usuario en localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.register('Felipe', 'test@pulse.cl', '123456')
    })

    const users = JSON.parse(localStorage.getItem('pulse_users') || '[]')
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('test@pulse.cl')
  })

  it('debe lanzar error al intentar registrar un email duplicado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.register('Usuario Uno', 'duplicado@pulse.cl', '123456')
    })

    expect(() => {
      act(() => {
        result.current.register('Usuario Dos', 'duplicado@pulse.cl', '654321')
      })
    }).toThrow('Este correo electrónico ya está registrado.')
  })

  it('debe iniciar sesión con credenciales correctas y actualizar el estado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.register('Felipe', 'felipe@pulse.cl', '123456')
    })

    act(() => {
      result.current.login('felipe@pulse.cl', '123456')
    })

    expect(result.current.user).toEqual({ name: 'Felipe', email: 'felipe@pulse.cl' })
    expect(localStorage.getItem('pulse_logged')).toBe('true')
  })

  it('debe cerrar sesión y limpiar datos de usuario activo', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.register('Felipe', 'felipe@pulse.cl', '123456')
      result.current.login('felipe@pulse.cl', '123456')
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('pulse_logged')).toBeNull()
  })

  it('debe alternar el estado Premium en el contexto y localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.setPremiumStatus(true)
    })

    expect(result.current.isPremium).toBe(true)
    expect(localStorage.getItem('pulse_premium')).toBe('true')
  })
})