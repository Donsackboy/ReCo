# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
	apt-get install -y build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev && \
	pip install --no-cache-dir -r requirements.txt
# Asegurar que Pillow esté instalado para ImageField

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
