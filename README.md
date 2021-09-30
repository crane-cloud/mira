# Mira

Automate app containerization.

## How to run locally

1.  ### Assumptions

- A working `Node` environment.

- An installation of the `yarn` package manager.

- Install the above if you have to.

2.  ### Running

- Install dependencies: `yarn install` or simply `yarn`.

- Create a `.env` file and add these values: `PORT=5000`.

- Start server: `node index.js` or `nodemon` if you have nodemon installed.

- To stop the server: `ctl + c`.

3.  ### Testing
        Request

        `POST /`
        `Content-Type: multipart/form-data`

        `payload: { files: file (any html file), name: string, tag: string (version), framework: string (use html for now), token: string (log into crane cloud and get token), project: string (any active project in your account) }`

        Response
    `201`
    `Content-Type: application/json`
    `body: { status: string, data: object }`
    The API will be standardized with time. Doesn't need a DB.
