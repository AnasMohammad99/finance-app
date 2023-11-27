# social-app 
## API Reference

#### root uri
```http
 http://localhost:5000
```
#### Register new user
```http
  POST /api/v1/auth/client/register
```

| Body Parameter | Type     | Description                |
| :--------      | :------- | :------------------------- |
| `email`        | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `username`     | `string` | **Required** |
| `password`     | `string` | **Required** must contain character, special character, more than 8 leters|
| `phoneNumber`  | `string` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `email`        | `string` | 
| `username`     | `string` | 
| `message`      | `string` | 
| `phoneNumber`  | `string` |
----------------------------------------------------------------
#### login user
```http
  POST /api/v1/auth/login
```
| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `email`        | `string` | **Required** |
| `password`     | `string` | **Required** |

### Response 
| Body Parameter | Type     | Description                | 
| :------------- | :------- | :------------------------- |
| `message`      | `string` | 
| `access_token` | `string` |
----------------------------------------------------------------
#### logout user
```http
  POST /api/vi/auth/logout
```

| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `message`       | `string` | 
----------------------------------------------------------------
#### delete user
```http
  DELETE /api/v1/auth/{id}
```
| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|
----------------------------------------------------------------
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
#### verify user email
```http
  POST /api/v1/auth/verifyEmail
```
| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `email`          | `string` | **Required** |
----------------------------------------------------------------
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 

#### reset user password
```http
  POST /api/v1/user/resetPassword/{token}
```
| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `email`          | `string` | **Required** |
| `password`       | `string` | **Required** |
----------------------------------------------------------------
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `email`        | `string` |
| `username`     | `string` |
----------------------------------------------------------------