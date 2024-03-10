# finance-app 
## API Reference

#### root uri
```http
 http://localhost:5000
```
#### Register new user
```http
  POST /auth/register
```

| Body Parameter | Type     | Description                |
| :--------      | :------- | :------------------------- |
| `email`        | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `username`     | `string` | **Required** |
| `password`     | `string` | **Required** must contain character, special character, more than 8 leters|
| `phoneNumber`  | `string` | **Required** **Unique**|
| `role`         | `string` | **Optional** choose between "USER" or "ADMIN" default "USER" |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `email`        | `string` | 
| `username`     | `string` | 
| `message`      | `string` | 
| `phoneNumber`  | `string` |
| `role`  | `string` |
----------------------------------------------------------------
#### login user
```http
  POST /auth/login
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
  POST /auth/logout
```

| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
----------------------------------------------------------------
#### delete user
```http
  DELETE /auth/{id}
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
  POST /auth/verifyEmail
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
  POST /user/resetPassword/{token}
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
#### add new transaction
```http
  POST /transaction
```

| Body Parameter | Type     | Description                |
| :--------      | :------- | :------------------------- |
| `sender_id`    | `number` | **Required** |
| `reciver_id`   | `number` | **Required** |
| `notes`        | `string` | **Optional** |
| `amount`       | `numbrt` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `notes`        | `string` | 
| `amount`       | `string` | 
| `message`      | `string` | 
----------------------------------------------------------------
#### get my transaction
```http
  POST /transaction/mytransaction?from=dateTime&page=number&limit=number
```

| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `notes`        | `string` | 
| `amount`       | `string` | 
| `message`      | `string` | 
----------------------------------------------------------------
#### get all transaction
```http
  GET /transaction?from=dateTime&page=number&limit=number
```
must be admin role

| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `notes`        | `string` | 
| `amount`       | `string` | 
| `message`      | `string` | 
----------------------------------------------------------------
#### get my summry
```http
  POST /transaction/summry/mysummry?from=dateTime&to=dateTime
```
| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `total_balance`| `string` | 
| `total_incomes`| `string` | 
| `total_expenses`| `string` | 
----------------------------------------------------------------
#### get any summry
```http
  GET /transaction/summry/{account_id}?from=dateTime&to=dateTime
```
must be admin role

| Header Parameter | Type     | Description                |
| :--------------- | :------- | :------------------------- |
| `authentication` | `string` | **Required** Bearer ${access_token}|
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `total_balance`| `string` | 
| `total_incomes`| `string` | 
| `total_expenses`| `string` | 
----------------------------------------------------------------
