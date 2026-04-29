import { useRef, useState } from 'react'

export default function FileUpload({ onUpload, loading }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div
      className={`upload-box ${dragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div className="upload-icon">📤</div>
      <h2>Drop a file here</h2>
      <p>or click to browse — stored on EBS PersistentVolume</p>

      {loading ? (
        <div className="upload-progress">
          <div className="spinner" />
          Uploading...
        </div>
      ) : (
        <button
          className="upload-btn"
          disabled={loading}
          onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}
        >
          Choose File
        </button>
      )}
    </div>
  )
}
