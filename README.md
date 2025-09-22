<!--
  Environment Variables Documentation

  - `VERIFY_URL`: Endpoint for internal authentication verification.
  - `BASE_PATH`: Base path for application routes.
  - `STORAGE_LOCAL_PATH`: Local directory for uploaded files.
  - `API_KEY`: API key for authentication/authorization.
  - `PORT`: Service listening port.
  - `ENV`: Environment mode (`dev` for development, `prod` for production).
-->

## Example `.env` File

```env
VERIFY_URL=http://localhost:3000/auth/internal/verify
BASE_PATH=/
STORAGE_LOCAL_PATH=./uploads/files
API_KEY=dev-key-12345
PORT=4000
ENV=dev  # dev | prod
```