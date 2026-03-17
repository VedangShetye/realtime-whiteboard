import { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

function Canvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [myColor, setMyColor] = useState('#000000')
  const lastPos = useRef(null)
  const cursorsRef = useRef({})
  const [cursors, setCursors] = useState({})

  useEffect(() => {
    const canvas = canvasRef.current

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    socket.on('init', (data) => {
      setMyColor(data.color)
    })

    socket.on('draw', (data) => {
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(data.x0, data.y0)
      ctx.lineTo(data.x1, data.y1)
      ctx.strokeStyle = data.color
      ctx.lineWidth = data.lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()
    })

    socket.on('cursor', (data) => {
      cursorsRef.current[data.id] = { x: data.x, y: data.y, color: data.color }
      setCursors({ ...cursorsRef.current })
    })

    socket.on('cursor-remove', (data) => {
      delete cursorsRef.current[data.id]
      setCursors({ ...cursorsRef.current })
    })

    return () => {
      window.removeEventListener('resize', resize)
      socket.off('draw')
      socket.off('cursor')
      socket.off('cursor-remove')
      socket.off('init')
    }
  }, [])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    lastPos.current = getPos(e)
  }

  const draw = (e) => {
    const pos = getPos(e)

    socket.emit('cursor', { x: pos.x, y: pos.y })

    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = myColor
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    socket.emit('draw', {
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: pos.x,
      y1: pos.y,
      color: myColor,
      lineWidth: 3
    })

    lastPos.current = pos
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ display: 'block', cursor: 'none' }}
      />
      {Object.entries(cursors).map(([id, cursor]) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: cursor.color,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  )
}

export default Canvas