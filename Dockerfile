# Railway currently builds this service from the repository root.  Keep this
# Dockerfile at that root so Railway reliably detects the Django backend in
# this monorepo; local Docker Compose continues to use backend/Dockerfile.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

RUN python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8000

# Railway supplies PORT at runtime. Apply migrations before serving the app.
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3"]
