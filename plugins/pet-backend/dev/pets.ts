import { Pet } from './types';

export const pets: Pet[] = [];

let currentDummyId = 0;

export const getNextId = () => {
  return ++currentDummyId;
};
