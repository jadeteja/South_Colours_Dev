import { faker } from '@faker-js/faker';

export interface TestUser {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface TestAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  type: string;
}

export const generateTestUser = (): TestUser => ({
  fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  email: `test_${Date.now()}_${faker.internet.email().toLowerCase()}`,
  phone: `9${faker.string.numeric(9)}`,
  password: 'Password@123#',
});

export const generateTestAddress = (): TestAddress => ({
  name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  phone: `9${faker.string.numeric(9)}`,
  addressLine1: faker.location.streetAddress(),
  addressLine2: faker.location.secondaryAddress(),
  city: 'Bengaluru',
  state: 'Karnataka',
  pinCode: '560001',
  type: 'Home',
});

export const staticTestData = {
  validCoupons: ['WELCOME10', 'SAVE20', 'KIDS10'],
  invalidCoupon: 'EXPIRED999',
  searchKeywords: {
    existing: 'Dress',
    specific: 'Kurta',
    noResults: 'xyznonexistentproduct999',
  },
  categories: [
    { name: 'Girls', slug: 'girls' },
    { name: 'Boys', slug: 'boys' },
    { name: 'Ethnic Wear', slug: 'ethnic-wear' },
    { name: 'Infants', slug: 'infants' },
  ],
};
