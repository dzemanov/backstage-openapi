# Documentation for Pet API

<a name="documentation-for-api-endpoints"></a>

## Documentation for API Endpoints

All URIs are relative to _http://localhost_

| Class        | Method                                                        | HTTP request            | Description        |
| ------------ | ------------------------------------------------------------- | ----------------------- | ------------------ |
| _DefaultApi_ | [**findPetsByTypeGet**](Apis/DefaultApi.md#findpetsbytypeget) | **GET** /findPetsByType | Get pets by type   |
| _DefaultApi_ | [**healthGet**](Apis/DefaultApi.md#healthget)                 | **GET** /health         | Health check       |
| _DefaultApi_ | [**petsGet**](Apis/DefaultApi.md#petsget)                     | **GET** /pets           | Get pets           |
| _DefaultApi_ | [**petsIdGet**](Apis/DefaultApi.md#petsidget)                 | **GET** /pets/{id}      | Get a pet by ID    |
| _DefaultApi_ | [**petsIdPut**](Apis/DefaultApi.md#petsidput)                 | **PUT** /pets/{id}      | Update a pet by ID |
| _DefaultApi_ | [**petsPost**](Apis/DefaultApi.md#petspost)                   | **POST** /pets          | Create a new pet   |

<a name="documentation-for-models"></a>

## Documentation for Models

- [Error](./Models/Error.md)
- [Error_error](./Models/Error_error.md)
- [Error_error_oneOf](./Models/Error_error_oneOf.md)
- [Error_request](./Models/Error_request.md)
- [Error_response](./Models/Error_response.md)
- [Pet](./Models/Pet.md)
- [PetCreate](./Models/PetCreate.md)
- [PetType](./Models/PetType.md)
- [PetUpdate](./Models/PetUpdate.md)
- [\_health_get_200_response](./Models/_health_get_200_response.md)

<a name="documentation-for-authorization"></a>

## Documentation for Authorization

<a name="JWT"></a>

### JWT

- **Type**: HTTP Bearer Token authentication (JWT)
