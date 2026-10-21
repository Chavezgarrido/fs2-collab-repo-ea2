import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  duration: 210,
  volume: 1,
  src: '',
}))

window.scrollTo = vi.fn()