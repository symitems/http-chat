FROM python:3.10-slim

WORKDIR /app
COPY ./requirements.txt ./requirements.txt

RUN pip install -U pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD [ "uvicorn", "main:app", "--reload", "--host", "0.0.0.0" ]
