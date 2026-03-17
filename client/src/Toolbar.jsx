function Toolbar({ color, setColor, lineWidth, setLineWidth, tool, setTool }) {
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1e1e1e',
      borderRadius: 12,
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>

      <button
        onClick={() => setTool('pen')}
        style={{
          background: tool === 'pen' ? '#ffffff22' : 'transparent',
          border: '1px solid #ffffff33',
          borderRadius: 8,
          color: 'white',
          padding: '6px 14px',
          cursor: 'pointer',
          fontSize: 18
        }}
      >✏️</button>

      <button
        onClick={() => setTool('eraser')}
        style={{
          background: tool === 'eraser' ? '#ffffff22' : 'transparent',
          border: '1px solid #ffffff33',
          borderRadius: 8,
          color: 'white',
          padding: '6px 14px',
          cursor: 'pointer',
          fontSize: 18
        }}
      >🧹</button>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
        title="Pick color"
      />

      <input
        type="range"
        min={1}
        max={20}
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
        style={{ width: 80, accentColor: color }}
        title="Stroke width"
      />

      <span style={{ color: 'white', fontSize: 13, minWidth: 20 }}>{lineWidth}px</span>

    </div>
  )
}

export default Toolbar