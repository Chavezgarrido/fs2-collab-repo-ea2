import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { PlayerProvider, usePlayer } from './PlayerContext'

const mockTracks = [
  { id: 1, titulo: 'Song 1', artista: 'Artist 1', audio: 'http://example.com/audio1.mp3' },
  { id: 2, titulo: 'Song 2', artista: 'Artist 2', audio: 'http://example.com/audio2.mp3' },
]

describe('PlayerContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sin pista seleccionada ni reproducción activa', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper: PlayerProvider })

    expect(result.current.currentTrack).toBeNull()
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('debe cargar y reproducir una pista por su índice', async () => {
    const { result } = renderHook(() => usePlayer(), { wrapper: PlayerProvider })

    await act(async () => {
      result.current.loadAndPlayTrack(0, mockTracks)
    })

    expect(result.current.currentIndex).toBe(0)
    expect(result.current.currentTrack.titulo).toBe('Song 1')
  })

  it('debe avanzar a la siguiente canción cíclicamente', async () => {
    const { result } = renderHook(() => usePlayer(), { wrapper: PlayerProvider })

    await act(async () => {
      result.current.loadAndPlayTrack(0, mockTracks)
    })

    await act(async () => {
      result.current.nextTrack()
    })
    expect(result.current.currentIndex).toBe(1)

    await act(async () => {
      result.current.nextTrack()
    })
    expect(result.current.currentIndex).toBe(0)
  })

  it('debe alternar canciones favoritas y sincronizar con localStorage', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper: PlayerProvider })

    act(() => {
      result.current.toggleLike(mockTracks[0])
    })

    expect(result.current.likedSongs).toHaveLength(1)
    expect(result.current.likedSongs[0].id).toBe(1)

    act(() => {
      result.current.toggleLike(mockTracks[0])
    })

    expect(result.current.likedSongs).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem('pulse_liked_songs'))).toEqual([])
  })
})