'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface EquipoTruco {
  id: number
  nombreequipo: string
  integranteuno: string
  integrantedos: string
}

interface EquipoCounter {
  id: number
  nombreequipo: string
  integranteuno: string
  integrantedos: string
  integrantetres: string
  integrantecuatro: string
  integrantecinco: string
}

export default function VerEquiposPage() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<'Truco' | 'Counter' | null>(null)
  const [equiposTruco, setEquiposTruco] = useState<EquipoTruco[]>([])
  const [equiposCounter, setEquiposCounter] = useState<EquipoCounter[]>([])
  const [filtroNombre, setFiltroNombre] = useState('') // Estado para el buscador
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!juegoSeleccionado) return

    const cargarEquipos = async () => {
      setCargando(true)
      setError(null)

      try {
        if (juegoSeleccionado === 'Truco') {
          const { data, error } = await supabase
            .from('truco')
            .select('id, integranteuno, integrantedos, nombreequipo')
          
          if (error) throw error
          setEquiposTruco(data || [])
        } else {
          const { data, error } = await supabase
            .from('counter')
            .select('id, nombreequipo, integranteuno, integrantedos, integrantetres, integrantecuatro, integrantecinco')
          
          if (error) throw error
          setEquiposCounter(data || [])
        }
      } catch (err: any) {
        setError(err.message || 'Error al conectar con la base de datos.')
      } finally {
        setCargando(false)
      }
    }

    cargarEquipos()
  }, [juegoSeleccionado])

  // Filtrado lógico local en tiempo real para Truco
  const equiposTrucoFiltrados = equiposTruco.filter((equipo) =>
    equipo.nombreequipo.toLowerCase().includes(filtroNombre.toLowerCase())
  )

  // Filtrado lógico local en tiempo real para Counter
  const equiposCounterFiltrados = equiposCounter.filter((equipo) =>
    equipo.nombreequipo.toLowerCase().includes(filtroNombre.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-8 text-indigo-400 tracking-wide uppercase">
          Equipos Registrados
        </h1>

        {/* Panel de Botones Principales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setEquiposCounter([])
              setEquiposTruco([])
              setFiltroNombre('') // Resetea el buscador al cambiar
              setJuegoSeleccionado('Truco')
            }}
            className={`py-4 px-6 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-lg ${
              juegoSeleccionado === 'Truco'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20 ring-2 ring-indigo-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-200'
            }`}
          >
            TRUCO
          </button>

          <button
            onClick={() => {
              setEquiposTruco([])
              setEquiposCounter([])
              setFiltroNombre('') // Resetea el buscador al cambiar
              setJuegoSeleccionado('Counter')
            }}
            className={`py-4 px-6 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-lg ${
              juegoSeleccionado === 'Counter'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20 ring-2 ring-indigo-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-200'
            }`}
          >
            COUNTER
          </button>
        </div>

        {/* Campo de búsqueda (Filtro) - Solo visible si hay un juego seleccionado */}
        {juegoSeleccionado && (
          <div className="mb-6 animate-fadeIn">
            <input
              type="text"
              placeholder="Buscar equipo por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        {/* Estado de Carga */}
        {cargando && (
          <div className="text-center py-12 text-gray-400 animate-pulse text-sm">
            Buscando escuadras en la base de datos...
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm mb-6 text-center">
            Error: {error}
          </div>
        )}

        {/* Listado de Equipos de Truco */}
        {!cargando && juegoSeleccionado === 'Truco' && (
          <div className="space-y-4">
            {equiposTrucoFiltrados.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">
                {equiposTruco.length === 0 
                  ? 'No hay parejas anotadas en Truco todavía.' 
                  : 'Ningún equipo coincide con la búsqueda.'}
              </p>
            ) : (
              equiposTrucoFiltrados.map((equipo) => (
                <div key={equipo.id} className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md text-center">
                  <h3 className="text-lg font-bold text-indigo-400 mb-3">{equipo.nombreequipo}</h3>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm text-gray-300">
                    <div className="bg-gray-900/50 px-4 py-2 rounded-lg min-w-[160px] text-center">
                      {equipo.integranteuno}
                    </div>
                    <div className="bg-gray-900/50 px-4 py-2 rounded-lg min-w-[160px] text-center">
                      {equipo.integrantedos}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Listado de Equipos de Counter */}
        {!cargando && juegoSeleccionado === 'Counter' && (
          <div className="space-y-4">
            {equiposCounterFiltrados.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">
                {equiposCounter.length === 0 
                  ? 'No hay escuadras anotadas en Counter Strike todavía.' 
                  : 'Ningún equipo coincide con la búsqueda.'}
              </p>
            ) : (
              equiposCounterFiltrados.map((equipo) => (
                <div key={equipo.id} className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md text-center">
                  <h3 className="text-lg font-bold text-indigo-400 mb-4">{equipo.nombreequipo}</h3>
                  
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* Fila Superior: 3 integrantes */}
                    <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-300 w-full">
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg min-w-[140px] text-center">{equipo.integranteuno}</div>
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg min-w-[140px] text-center">{equipo.integrantedos}</div>
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg min-w-[140px] text-center">{equipo.integrantetres}</div>
                    </div>

                    {/* Fila Inferior: 2 integrantes */}
                    <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-300 w-full">
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg min-w-[140px] text-center">{equipo.integrantecuatro}</div>
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg min-w-[140px] text-center">{equipo.integrantecinco}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Estado Inicial (Sin selección) */}
        {!juegoSeleccionado && (
          <div className="text-center py-16 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
            Selecciona un juego para auditar la lista de inscritos.
          </div>
        )}
      </div>
    </div>
  )
}
