import { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Toolbar from './Toolbar'

const socket = io('http://localhost:3001')

function Canvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [myColor, setMyColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(3)
  const [tool, setTool] = useState('pen')
  const lastPos = useRef(null)
  const historyRef = useRef([])
  const redoStackRef = useRef([])
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

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        redoStackRef.current.push(historyRef.current.pop())
        if (historyRef.current.length === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        } else {
          const img = new Image()
          img.src = historyRef.current[historyRef.current.length - 1]
          img.onload = () => ctx.drawImage(img, 0, 0)
        }
      }
      if (e.ctrlKey && e.key === 'y') {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const next = redoStackRef.current.pop()
        if (next) {
          historyRef.current.push(next)
          const img = new Image()
          img.src = next
          img.onload = () => ctx.drawImage(img, 0, 0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

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
      window.removeEventListener('keydown', handleKeyDown)
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

    const strokeColor = tool === 'eraser' ? '#ffffff' : myColor
    const strokeWidth = tool === 'eraser' ? 20 : lineWidth

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    socket.emit('draw', {
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: pos.x,
      y1: pos.y,
      color: strokeColor,
      lineWidth: strokeWidth
    })

    lastPos.current = pos
  }

  const stopDrawing = () => {
    if (isDrawing) saveSnapshot()
    setIsDrawing(false)
    lastPos.current = null
  }

  const saveSnapshot = () => {
    const canvas = canvasRef.current
    historyRef.current.push(canvas.toDataURL())
    redoStackRef.current = []
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Toolbar
        color={myColor}
        setColor={setMyColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        tool={tool}
        setTool={setTool}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ display: 'block', cursor: 'crosshair' }}
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