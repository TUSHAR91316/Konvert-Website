import os
import re
import shutil
import subprocess
import uuid
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

app = FastAPI()

UPLOAD_DIR = "/tmp/uploads"
OUTPUT_DIR = "/tmp/outputs"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/convert")
async def convert_file(file: UploadFile = File(...), target_format: str = "pdf"):
    # 1. Save uploaded file
    file_id = str(uuid.uuid4())
    
    # Sanitize filename to prevent path traversal
    safe_filename = os.path.basename(file.filename) if file.filename else "upload"
    safe_filename = re.sub(r'[^a-zA-Z0-9.-]', '_', safe_filename)
    
    input_filename = f"{file_id}_{safe_filename}"
    input_path = os.path.join(UPLOAD_DIR, input_filename)
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Determine conversion command
    # Simple LibreOffice conversion: --convert-to pdf
    
    # Validation: valid formats?
    valid_targets = ["pdf", "docx", "doc", "odt", "jpg", "png"]
    if target_format not in valid_targets:
        raise HTTPException(status_code=400, detail="Invalid target format")

    output_path = None
    try:
        # 3. Run LibreOffice (headless)
        # unoconv or libreoffice directly
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to", target_format,
            "--outdir", OUTPUT_DIR,
            input_path
        ]
        
        logger.info(f"Starting conversion for {input_filename} to {target_format}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)  # 5 min timeout
        
        if result.returncode != 0:
            logger.error(f"Conversion failed: {result.stderr}")
            raise HTTPException(status_code=500, detail="Conversion process failed")
            
        # 4. Find output file
        # LibreOffice typically keeps the basename and changes extension
        base_name = os.path.splitext(input_filename)[0]
        # output filename might vary slightly depending on LibreOffice version/format
        # e.g. input.docx -> input.pdf
        
        # We need to find the file in OUTPUT_DIR that matches the pattern
        expected_output_filename = f"{base_name}.{target_format}"
        output_path = os.path.join(OUTPUT_DIR, expected_output_filename)
        
        if not os.path.exists(output_path):
             # Fallback: search for any file starting with base_name
             for f in os.listdir(OUTPUT_DIR):
                 if f.startswith(base_name) and f.endswith(f".{target_format}"):
                     output_path = os.path.join(OUTPUT_DIR, f)
                     break
             else:
                 raise HTTPException(status_code=500, detail="Output file not found after conversion")

        logger.info(f"Conversion successful: {output_path}")
        # 5. Return file
        return FileResponse(output_path, filename=f"converted.{target_format}")

    except subprocess.TimeoutExpired:
        logger.error("Conversion timed out")
        raise HTTPException(status_code=408, detail="Conversion timed out")
    except Exception as e:
        logger.error(f"Error during conversion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup input and output
        if os.path.exists(input_path):
            os.remove(input_path)
        if output_path and os.path.exists(output_path):
            # Note: FileResponse sends the file, but we can't delete it immediately.
            # In production, use a background task or temp files with auto-delete.
            pass  # For now, leave it; in real app, implement proper cleanup
