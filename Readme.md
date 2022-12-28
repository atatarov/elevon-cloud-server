# Quick start guide

## Production:
Create default.json. 
```
config/default.json
```
Install deps:
```
npm i
```
Run application:
```
node app.js
```

## Devel:
Create dev.json.
```
config/dev.json
```
Install deps:
```
npm i
```
Run dev
```
npm run dev
```

## Tests:
Create test.json.
```
config/test.json
```
Install deps:
```
npm i
```
Run tests:
```
npm test
```

### Config-Template
```
/home/my-projects/elevon-cloud-server/config/test.json
{
  "PORT": "3020",
  "DBHost": "mongodb://localhost:27017/elevon-cloud",
  "STORAGE_NAME": "files",
  "STATIC_DIR_NAME": "static",
  "JWT_ACCESS_SECRET": "jwt-access-secret-key",
  "JWT_REFRESH_SECRET": "jwt-refresh-secret-key",
  "SMTP_HOST": "",
  "SMTP_PORT": "",
  "SMTP_USER": "",
  "SMTP_PASSWORD": "",
  "API_URL": "https://elevon-cloud-server.fvds.ru",
  "CLIENT_URL": "https://elevon-cloud.fvds.ru",
  "TEST_USER_EMAIL": ""
}
```
