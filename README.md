# Simple example project to showcase OpenAPI usage in Backstage

## Overview

This project is an example approach to using OpenAPI and schema-first plugins in Backstage.
In this project, we will:

1. Generate OpenApi yaml schema of our simple example `pet-backend` plugin using `optic` and plugin tests
2. Use OpenApiRouter in our `pet-backend` to take advantage of typed express router with validation and verification tooling
3. Add swagger support to `pet-backend`
4. Auto-generate documentation from OpenApi schema

You can switch to respective branches 1-4 of this repo to view all required changes for them.
[Reference](https://backstage.io/docs/openapi/01-getting-started/)

## Run

To start the app, run:

```sh
yarn install
yarn dev
```

## Guide

### 1. Generate OpenApi schema from tests

#### Prerequisites

```[bash]
yarn add @useoptic/optic -W --dev
yarn add @backstage/repo-tools -W --dev
cd pet-backend
yarn add @backstage/backend-openapi-utils
```

#### Code changes

Generate `optic.yml` configuration under `pet-backend`:

(Note: dummy openapi.yaml schema must already be under `src -> schema -> openapi.yaml`).
Or you can copy it from: https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/optic.yml

```[bash]
cd pet-backend
yarn backstage-repo-tools package schema openapi init
```

Add the following lines to your `createRouter.test.ts` or `router.test.ts` file
(Enables optic proxy for test.)

```[javascript]
+ import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils';
+ import { Server } from 'http';

...

describe('createRouter', () => {
- let app: express.Express;
+ let app: express.Express | Server;

...

- app = express().use(router);
+ app = wrapInOpenApiTestServer(express().use(router));

```

Run to create `src/schema/openapi.yaml`:

```[bash]
PORT=3000 yarn optic capture src/schema/openapi.yaml --update interactive
```

### 2. Use OpenApiRouter

Generate `openapi.generated.ts` under `pet-backend/src/schema`:

```[bash]
yarn backstage-repo-tools package schema openapi generate --server
```

Use OpenApiRouter in `pet-backend/src/service/router.ts`:

```[javascript]
+ import { createOpenApiRouter } from '../schema/openapi.generated';
- import Router from 'express-promise-router';

...
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
+ const router = await createOpenApiRouter();
- const router = Router();
```

### 3. Swagger

Install [`@backstage/plugin-catalog-backend-module-backstage-openapi`](https://www.npmjs.com/package/@backstage/plugin-catalog-backend-module-backstage-openapi)

You can access plugin swagger documentation in `BackstageAPI` entity.

### 4. Auto-generate documentation

```[bash]
cd pet-backend
yarn build:api-docs
```
