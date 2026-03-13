# lovealarm-be

This is the backend for Love Alarm project

# config .env file

Use website https://jwtsecrets.com/ to generate 2 random token with length = 256 bits for ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET

Go to mongodb atlas, get CONNECTION_STRING and replace username and password with your own username and password

## Firebase Admin credentials

Do not hardcode a key file path in source code.

Use one of these options:

1. `FIREBASE_SERVICE_ACCOUNT_JSON` (recommended for deployment/secrets manager)
2. `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON file for local machine)

Optional:

- `FIREBASE_PROJECT_ID` (used as explicit fallback project id)

Example `.env` values:

- `FIREBASE_PROJECT_ID=love-alarm-c4454`
- `FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}`

# update swagger

use command [npm run swagger] to update swagger after add, remove or update apis

# On development stage

run [npm run dev] for development stage
