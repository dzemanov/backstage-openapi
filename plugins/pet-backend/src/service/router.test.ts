import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils';
import { Server } from 'http';
import { getNextId, pets } from '../../dev/pets';
import { PetType } from '../../dev/types';

jest.mock('../../dev/pets', () => ({
  pets: [],
  getNextId: jest.fn(),
}));

describe('createRouter', () => {
  let app: express.Express | Server;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig(),
    });
    app = wrapInOpenApiTestServer(express().use(router));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    pets.length = 0;
    let currentDummyId = 0;
    (getNextId as jest.Mock).mockImplementation(() => ++currentDummyId);
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /pets/:id', () => {
    it('returns a pet if found', async () => {
      const testPet = { id: 1, name: 'Fluffy', petType: PetType.cat };
      pets.push(testPet);

      const response = await request(app).get('/pets/1');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testPet);
    });

    it('returns 404 if pet not found', async () => {
      const response = await request(app).get('/pets/1');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: 'Pet not found' });
    });
  });

  describe('GET /pets', () => {
    it('returns pets matching the name query parameter', async () => {
      const testPets = [
        { id: 1, name: 'Fluffy', petType: PetType.cat },
        { id: 2, name: 'Rex', petType: PetType.dog },
        { id: 3, name: 'Fluffy', petType: PetType.dog },
      ];
      pets.push(...testPets);
      const expected = [
        { id: 1, name: 'Fluffy', petType: PetType.cat },
        { id: 3, name: 'Fluffy', petType: PetType.dog },
      ];

      const response = await request(app).get('/pets?name=Fluffy');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expected);
    });

    it('returns all pets if name query parameter is missing', async () => {
      const testPets = [
        { id: 1, name: 'Fluffy', petType: PetType.cat },
        { id: 2, name: 'Rex', petType: PetType.dog },
        { id: 3, name: 'Fluffy', petType: PetType.dog },
      ];
      pets.push(...testPets);

      const response = await request(app).get('/pets');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testPets);
    });
  });

  describe('GET /findPetsByType', () => {
    it('returns pets matching the petType query parameter', async () => {
      const testPets = [
        { id: 1, name: 'Dory', petType: PetType.fish },
        { id: 2, name: 'Rex', petType: PetType.dog },
        { id: 3, name: 'Nemo', petType: PetType.fish },
      ];
      pets.push(...testPets);
      const expected = [
        { id: 1, name: 'Dory', petType: PetType.fish },
        { id: 3, name: 'Nemo', petType: PetType.fish },
      ];

      const response = await request(app).get('/findPetsByType?petType=fish');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expected);
    });

    it('returns 400 if petType query parameter is missing', async () => {
      const response = await request(app).get('/findPetsByType');
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual({
        name: 'InputError',
        message: "request/query must have required property 'petType'",
      });
    });
  });

  describe('POST /pets', () => {
    it('creates a new pet', async () => {
      const newPet = { name: 'Fluffy', petType: PetType.cat };

      const response = await request(app).post('/pets').send(newPet);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: 1,
        name: 'Fluffy',
        petType: PetType.cat,
      });
      expect(pets).toContainEqual({
        id: 1,
        name: 'Fluffy',
        petType: PetType.cat,
      });
    });
  });

  describe('PUT /pets/:id', () => {
    it('updates an existing pet', async () => {
      const existingPet = { id: 1, name: 'Fluffy', petType: PetType.cat };
      const petToUpdate = { name: 'Whiskers', petType: PetType.cat };
      pets.push(existingPet);

      const response = await request(app).put('/pets/1').send(petToUpdate);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: 1, ...petToUpdate });
      expect(pets[0]).toEqual({ id: 1, ...petToUpdate });
    });

    it('returns 404 if pet not found', async () => {
      const response = await request(app)
        .put('/pets/1')
        .send({ name: 'Whiskers' });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: 'Pet not found' });
    });
  });
});
