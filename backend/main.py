from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
import os

app = FastAPI(title="FileStore API")

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/data/uploads"))
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "upload_dir": str(UPLOAD_DIR)}


@app.get("/files")
def list_files():
    files = []
    for f in UPLOAD_DIR.iterdir():
        if f.is_file():
            stat = f.stat()
            files.append({
                "name": f.name,
                "size": stat.st_size,
                "modified": stat.st_mtime,
            })
    return sorted(files, key=lambda x: x["modified"], reverse=True)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = Path(file.filename).name
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    content = await file.read()

    if len(content) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_UPLOAD_SIZE_MB}MB limit")

    dest = UPLOAD_DIR / filename
    dest.write_bytes(content)

    return {"filename": filename, "size": len(content)}


@app.get("/files/{filename}")
def download_file(filename: str):
    filename = Path(filename).name
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=filename)


@app.delete("/files/{filename}")
def delete_file(filename: str):
    filename = Path(filename).name
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    file_path.unlink()
    return {"message": f"{filename} deleted"}
