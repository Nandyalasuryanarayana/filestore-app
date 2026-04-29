import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import './App.css'

const API = '/api'

export default function App() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, text) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API}/files`)
      setFiles(await res.json())
    } catch {
      showToast('error', 'Could not reach the backend')
    }
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (file) => {
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch(`${API}/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      showToast('success', `${file.name} uploaded successfully`)
      fetchFiles()
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (filename) => {
    try {
      await fetch(`${API}/files/${encodeURIComponent(filename)}`, { method: 'DELETE' })
      showToast('success', `${filename} deleted`)
      fetchFiles()
    } catch {
      showToast('error', 'Delete failed')
    }
  }

  const handleDownload = (filename) => {
    window.open(`${API}/files/${encodeURIComponent(filename)}`, '_blank')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-wrap">
            <span className="logo-icon">⬡</span>
            <div>
              <h1>FileStore</h1>
              <p>Persistent file storage on Kubernetes EBS</p>
            </div>
          </div>
          <span className="badge">Running on EKS</span>
        </div>
      </header>

      <main className="main">
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.text}
          </div>
        )}

        <FileUpload onUpload={handleUpload} loading={loading} />
        <FileList
          files={files}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </main>

      <footer className="footer">
        Built with React + FastAPI · Deployed on EKS via ArgoCD · Secrets from HashiCorp Vault
      </footer>
    </div>
  )
}
