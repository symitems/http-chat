# Http Chat

Simple chat application consisting of frontend UI and backend API communicating with http.

## Usage

1. Clone this repository
    ```
    git clone https://github.com/iwsh/http-chat.git
    cd http-chat
    ```

1. Create your .env file
    ```
    cp .env.sample .env
    vi .env
    ```
    - You can get client id and secret by creating OAuth app on Github
        https://docs.github.com/developers/apps/building-oauth-apps/creating-an-oauth-app
    - If you use database on docker, variables like "PG_*" aren't needed



1. Build images and start containers
    ```
    # Use external database
    docker compose -f docker-compose.prod.yml up

    # Use database on docker
    docker compose -f docker-compose.develop.yml up
    ```

1. Access to http://localhost:3000
