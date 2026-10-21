import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { AuthProvider } from '../context/AuthContext'

describe('Login Page', () => {
  it('debe mostrar mensaje de error si las credenciales no existen', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('nombre@ejemplo.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /entrar a pulse/i })

    fireEvent.change(emailInput, { target: { value: 'noexiste@pulse.cl' } })
    fireEvent.change(passInput, { target: { value: 'passwordErroneo' } })
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Correo electrónico o contraseña incorrectos.'
    )
  })
})