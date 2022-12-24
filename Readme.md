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
{
  "PORT": "3020",
  "DBHost": "mongodb://localhost:27017/dbname",
  "STORAGE_NAME": "name",
  "STATIC_DIR_NAME": "name",
  "SECRET_KEY": "some-secret-key"
}
```

### Example:
/home/my-projects/elevon-cloud-server/config/default.json
```
{
  "PORT": "3020",
  "DBHost": "mongodb://localhost:27017/elevon-cloud",
  "STORAGE_NAME": "files",
  "STATIC_DIR_NAME": "static",
  "SECRET_KEY": "some-secret-key"
}
```
