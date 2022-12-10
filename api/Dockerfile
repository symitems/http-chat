FROM python:3.10-slim

WORKDIR /app
COPY ./requirements.txt ./requirements.txt

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install -U pip
RUN pip install --no-cache-dir -r requirements.txt
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh


COPY . .
CMD [ "uvicorn", "main:app", "--reload", "--host", "0.0.0.0" ]
