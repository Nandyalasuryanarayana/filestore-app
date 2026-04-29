const FILE_ICONS = {
  pdf: '📄', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️',
  mp4: '🎬', mov: '🎬', avi: '🎬',
  mp3: '🎵', wav: '🎵',
  zip: '📦', tar: '📦', gz: '📦',
  js: '📜', ts: '📜', jsx: '📜', tsx: '📜', py: '📜', go: '📜',
  json: '📋', yaml: '📋', yml: '📋', toml: '📋',
  sh: '⚙️', tf: '⚙️', dockerfile: '🐳',
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  return FILE_ICONS[ext] || '📁'
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleString()
}

export default function FileList({ files, onDelete, onDownload }) {
  return (
    <div className="file-list">
      <div className="file-list-header">
        <h2>Stored Files</h2>
        <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">No files yet — upload one above</div>
      ) : (
        files.map((f) => (
          <div key={f.name} className="file-row">
            <span className="file-icon">{fileIcon(f.name)}</span>
            <div className="file-info">
              <div className="file-name">{f.name}</div>
              <div className="file-meta">{formatSize(f.size)} · {formatTime(f.modified)}</div>
            </div>
            <div className="file-actions">
              <button className="btn-icon" onClick={() => onDownload(f.name)}>↓ Download</button>
              <button className="btn-icon danger" onClick={() => onDelete(f.name)}>✕ Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
