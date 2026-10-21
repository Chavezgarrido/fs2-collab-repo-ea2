// Normalizador uniforme de datos de pistas
const mapTrack = (t) => ({
  id: t.trackId,
  titulo: t.trackName || 'Sin título',
  artista: t.artistName || 'Artista desconocido',
  album: t.collectionName || 'Álbum / Sencillo',
  caratula: t.artworkUrl100 ? t.artworkUrl100.replace('100x100bb', '600x600bb') : '',
  caratulaMini: t.artworkUrl100 || '',
  audio: t.previewUrl,
  duracionRealSegundos: t.trackTimeMillis ? Math.floor(t.trackTimeMillis / 1000) : 210,
});

// Transforma segundos al formato "MM:SS"
export const formatSeconds = (segundos) => {
  if (isNaN(segundos) || segundos <= 0) return '0:00';
  const mins = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// 1. Búsqueda por término o género (Billboard, Pop Rock, etc.)
export const searchItunes = async (termino, limite = 15) => {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(termino)}&entity=song&limit=${limite}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al conectar con iTunes');
    const data = await res.json();
    return (data.results || []).filter((t) => t.previewUrl).map(mapTrack);
  } catch (error) {
    console.error('Error en searchItunes:', error);
    return [];
  }
};

// 2. Búsqueda filtrada para discografía de un artista específico
export const searchSongsByArtist = async (nombreArtista, limite = 35) => {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(nombreArtista)}&entity=song&limit=100`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al consultar artista');
    const data = await res.json();

    const artistaBuscadoNorm = nombreArtista.trim().toLowerCase();
    let resultadosFiltrados = (data.results || []).filter((t) => {
      if (!t.previewUrl || !t.artistName) return false;
      const nombreEnTrack = t.artistName.trim().toLowerCase();
      return nombreEnTrack.includes(artistaBuscadoNorm) || artistaBuscadoNorm.includes(nombreEnTrack);
    });

    if (resultadosFiltrados.length === 0) {
      resultadosFiltrados = data.results || [];
    }

    return resultadosFiltrados.slice(0, limite).map(mapTrack);
  } catch (err) {
    console.error('Error en searchSongsByArtist:', err);
    return [];
  }
};

// 3. Búsqueda global categorizada (Artistas, Canciones, Álbumes)
export const searchGlobalData = async (query) => {
  try {
    let urlArtista = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&attribute=artistTerm&limit=50`;
    let res = await fetch(urlArtista);
    let data = await res.json();
    let raw = data.results || [];

    if (raw.length < 5) {
      const urlGeneral = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=50`;
      const resGen = await fetch(urlGeneral);
      const dataGen = await resGen.json();
      raw = [...raw, ...(dataGen.results || [])];
    }

    if (raw.length === 0) return null;

    const queryNorm = query.trim().toLowerCase();

    // Deduplicar artistas
    const artistasMap = new Map();
    raw.forEach((item) => {
      if (item.artistName && !artistasMap.has(item.artistName.toLowerCase())) {
        artistasMap.set(item.artistName.toLowerCase(), {
          nombre: item.artistName,
          genero: item.primaryGenreName || 'Banda / Artista',
          foto: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : '',
        });
      }
    });

    const artistas = Array.from(artistasMap.values())
      .sort((a, b) => (a.nombre.toLowerCase().includes(queryNorm) ? -1 : 1))
      .slice(0, 4);

    // Canciones
    const cancionesMap = new Map();
    raw.forEach((t) => {
      if (t.previewUrl && !cancionesMap.has(t.trackId)) {
        cancionesMap.set(t.trackId, mapTrack(t));
      }
    });

    const canciones = Array.from(cancionesMap.values()).sort((a, b) => {
      const aEsArtista = a.artista.toLowerCase().includes(queryNorm) ? -1 : 1;
      const bEsArtista = b.artista.toLowerCase().includes(queryNorm) ? -1 : 1;
      return aEsArtista - bEsArtista;
    });

    // Álbumes
    const albumesMap = new Map();
    raw.forEach((item) => {
      if (item.collectionName && !albumesMap.has(item.collectionName.toLowerCase())) {
        albumesMap.set(item.collectionName.toLowerCase(), {
          titulo: item.collectionName,
          artista: item.artistName,
          caratula: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : '',
        });
      }
    });

    const albumes = Array.from(albumesMap.values()).slice(0, 4);

    return { artistas, canciones, albumes };
  } catch (error) {
    console.error('Error en searchGlobalData:', error);
    return null;
  }
};