FROM python:3.12-slim

# Install LibreOffice and dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    default-jre \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
RUN pip install fastapi uvicorn python-multipart gunicorn

COPY . /app

# Expose port (Cloud Run sets PORT env var, defaults to 8080 usually)
EXPOSE 8080

# Add Healthcheck to automatically restart on freezes
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# Use Gunicorn to manage Uvicorn workers for robustness
CMD sh -c "gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\${PORT:-8080}"
