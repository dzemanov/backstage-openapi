export const enum PetType {
  dog = 'dog',
  cat = 'cat',
  fish = 'fish',
}

export type Pet = {
  id: number;
  name: string;
  petType: PetType;
  age: number;
};
