import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TrackRow from './TrackRow'
import { PlayerProvider } from '../../context/PlayerContext'

const dummyTrack = {
  id: 10,
  titulo: 'Under Pressure',
  artista: 'Queen & David Bowie',
  album: 'Hot Space',
  caratulaMini: 'http://example.com/cover.jpg',
  duracionRealSegundos: 248,
}

describe('TrackRow Component', () => {
  it('debe mostrar el título, artista, álbum y duración formateada', () => {
    render(
      <PlayerProvider>
        <table>
          <tbody>
            <TrackRow track={dummyTrack} index={0} onPlay={vi.fn()} />
          </tbody>
        </table>
      </PlayerProvider>
    )

    expect(screen.getByText('Under Pressure')).toBeInTheDocument()
    expect(screen.getByText('Queen & David Bowie')).toBeInTheDocument()
    expect(screen.getByText('Hot Space')).toBeInTheDocument()
    expect(screen.getByText('4:08')).toBeInTheDocument()
  })

  it('debe llamar a onPlay al hacer clic en la fila', () => {
    const handlePlay = vi.fn()
    render(
      <PlayerProvider>
        <table>
          <tbody>
            <TrackRow track={dummyTrack} index={0} onPlay={handlePlay} />
          </tbody>
        </table>
      </PlayerProvider>
    )

    fireEvent.click(screen.getByText('Under Pressure'))
    expect(handlePlay).toHaveBeenCalledTimes(1)
  })
})