FROM python:3.10-bullseye

WORKDIR /app

COPY ./requirements.txt /app

RUN pip install -r requirements.txt

COPY . .
EXPOSE 8080

ENV ENV=production
ENTRYPOINT ["gunicorn", "server:server"]