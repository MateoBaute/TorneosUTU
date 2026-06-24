'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase' // Asegúrate de que la ruta sea correcta según tu proyecto

export default function Home() {
  const [juego, setJuego] = useState<'Counter' | 'Truco' | null>(null)
  const [nombreEquipo, setNombreEquipo] = useState('')

  // Estados para los integrantes de los equipos
  const [integrantesCounter, setIntegrantesCounter] = useState<string[]>(Array(5).fill(''))
  const [integrantesTruco, setIntegrantesTruco] = useState<string[]>(Array(2).fill(''))

  // Estado para controlar la carga y respuestas del servidor
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null)

  // Manejador del cambio de inputs dinámicos
  const handleIntegranteChange = (index: number, valor: string, tipo: 'Counter' | 'Truco') => {
    if (tipo === 'Counter') {
      const nuevos = [...integrantesCounter]
      nuevos[index] = valor
      setIntegrantesCounter(nuevos)
    } else {
      const nuevos = [...integrantesTruco]
      nuevos[index] = valor
      setIntegrantesTruco(nuevos)
    }
  }

  // Envío del formulario a Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    if (!nombreEquipo.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre del equipo es obligatorio.' })
      setLoading(false)
      return
    }

    try {
      if (juego === 'Truco') {
        // Validación de campos para Truco
        if (!integrantesTruco[0] || !integrantesTruco[1]) {
          throw new Error('Debes completar el nombre de ambos integrantes para Truco.')
        }

        // Inserción en la tabla 'truco' que creamos previamente
        const { error } = await supabase
          .from('truco')
          .insert([
            {
              nombreequipo: nombreEquipo,
              integranteuno: integrantesTruco[0],
              integrantedos: integrantesTruco[1],
            },
          ])

        if (error) throw error

        setMensaje({ tipo: 'exito', texto: '¡Equipo de Truco registrado con éxito!' })
        // Limpiar formulario
        setNombreEquipo('')
        setIntegrantesTruco(Array(2).fill(''))
        setJuego(null)

      } else if (juego === 'Counter') {
        // 1. Inserción en la tabla 'counter' usando el array correcto de integrantes
        const { error } = await supabase
          .from('counter')
          .insert([
            {
              nombreequipo: nombreEquipo,
              integranteuno: integrantesCounter[0],
              integrantedos: integrantesCounter[1],
              integrantetres: integrantesCounter[2],
              integrantecuatro: integrantesCounter[3],
              integrantecinco: integrantesCounter[4],
            },
          ])

        if (error) throw error

        // 2. Mensaje de éxito real
        setMensaje({ tipo: 'exito', texto: '¡Equipo de Counter Strike registrado con éxito!' })

        // 3. Limpiar formulario con los estados correspondientes a Counter
        setNombreEquipo('')
        setIntegrantesCounter(Array(5).fill(''))
        setJuego(null)
      }

    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Ocurrió un error al registrar.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center flex-col gap-4 justify-center p-6">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/60 p-6 shadow-xl">
        <h2 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2 tracking-wide uppercase text-sm">
          <span>🎮</span> Guía de Inscripción
        </h2>

        <ol className="space-y-4 relative border-l-2 border-gray-700 ml-2.5">
          {/* Paso 1 */}
          <li className="pl-6 relative">
            <div className="absolute -left-[11px] top-0.5 bg-indigo-500 text-gray-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-gray-800">
              1
            </div>
            <h3 className="font-semibold text-gray-200 text-sm">Identifica a tu Equipo</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Escribe el nombre oficial de tu grupo en el cuadro "Nombre del Equipo". Asegúrate de que no tenga letras extraños (-, /, *, #, !, $, etc.).
            </p>
          </li>

          {/* Paso 2 */}
          <li className="pl-6 relative">
            <div className="absolute -left-[11px] top-0.5 bg-indigo-500 text-gray-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-gray-800">
              2
            </div>
            <h3 className="font-semibold text-gray-200 text-sm">Elige qué vas a jugar</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">

              Despliega la lista de "Juego" y selecciona el torneo en el que van a competir: "Counter Strike 1.6" o "Truco".
            </p>
          </li>

          {/* Paso 3 */}
          <li className="pl-6 relative">
            <div className="absolute -left-[11px] top-0.5 bg-indigo-500 text-gray-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-gray-800">
              3
            </div>
            <h3 className="font-semibold text-gray-200 text-sm">Completa el Rosters</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Se habilitarán los campos según el juego. Escribe los nombres de los "5 integrantes" para CS 1.6 o la "pareja (2 integrantes)" para Truco. Todos los campos son obligatorios.
            </p>
          </li>

          {/* Paso 4 */}
          <li className="pl-6 relative">
            <div className="absolute -left-[11px] top-0.5 bg-emerald-500 text-gray-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-gray-800">
              4
            </div>
            <h3 className="font-semibold text-emerald-400 text-sm">Confirma el Registro</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Presiona "Registrar Equipo". Espera el mensaje verde de éxito en pantalla para asegurar tu cupo en la base de datos.
            </p>
          </li>
        </ol>
      </div>
      {/* Formulario */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">

        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-400 tracking-wide">
          Inscripción de Equipos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre del Equipo */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">
              Nombre del Equipo
            </label>
            <input
              type="text"
              placeholder="UTU Team"
              value={nombreEquipo}
              onChange={(e) => setNombreEquipo(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Selector de Juego */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">
              Juego
            </label>
            <select
              onChange={(e) => setJuego(e.target.value as 'Counter' | 'Truco')}
              value={juego || ""}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              required
            >
              <option value="" disabled hidden>Seleccione juego</option>
              <option value="Counter">Counter Strike 1.6</option>
              <option value="Truco">Truco</option>
            </select>
          </div>

          {/* Campos dinámicos para Counter Strike (5 Integrantes) */}
          {juego === 'Counter' && (
            <div className="pt-4 border-t border-gray-700 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-2">
                Integrantes del Equipo (CS 1.6)
              </h2>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div key={num}>
                  <label className="block text-xs font-medium mb-1 text-gray-400">
                    Integrante {num}
                  </label>
                  <input
                    type="text"
                    placeholder={`Nombre jugador ${num}`}
                    value={integrantesCounter[index]}
                    onChange={(e) => handleIntegranteChange(index, e.target.value, 'Counter')}
                    className="w-full px-4 py-2 bg-gray-750 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Campos dinámicos para Truco (2 Integrantes) */}
          {juego === 'Truco' && (
            <div className="pt-4 border-t border-gray-700 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-2">
                Integrantes de la Pareja (Truco)
              </h2>
              {[1, 2].map((num, index) => (
                <div key={num}>
                  <label className="block text-xs font-medium mb-1 text-gray-400">
                    Integrante {num}
                  </label>
                  <input
                    type="text"
                    placeholder={`Nombre jugador ${num}`}
                    value={integrantesTruco[index]}
                    onChange={(e) => handleIntegranteChange(index, e.target.value, 'Truco')}
                    className="w-full px-4 py-2 bg-gray-750 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Mensajes de feedback */}
          {mensaje && (
            <div className={`p-3 rounded-xl text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
              {mensaje.texto}
            </div>
          )}

          {/* Botón de Enviar */}
          {juego && (
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              {loading ? 'Registrando...' : 'Registrar Equipo'}
            </button>
          )}
        </form>

      </div>
    </div>
  )
}
