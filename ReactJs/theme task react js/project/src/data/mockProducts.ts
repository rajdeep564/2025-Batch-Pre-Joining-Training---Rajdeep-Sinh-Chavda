import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const mockProducts: Product[] = [
  {
    id: uuidv4(),
    name: 'Smartphone X',
    category: 'Electronics',
    price: 999.99,
    stock: 50,
    description: 'Latest smartphone with advanced features',
    createdAt: new Date('2023-01-15')
  },
  {
    id: uuidv4(),
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1499.99,
    stock: 30,
    description: 'High-performance laptop for professionals',
    createdAt: new Date('2023-02-20')
  },
  {
    id: uuidv4(),
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 199.99,
    stock: 100,
    description: 'Premium noise-cancelling wireless headphones',
    createdAt: new Date('2023-03-10')
  },
  {
    id: uuidv4(),
    name: 'Smart Watch',
    category: 'Wearables',
    price: 299.99,
    stock: 75,
    description: 'Fitness and health tracking smartwatch',
    createdAt: new Date('2023-04-05')
  },
  {
    id: uuidv4(),
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 129.99,
    stock: 60,
    description: 'Portable waterproof bluetooth speaker',
    createdAt: new Date('2023-05-12')
  },
  {
    id: uuidv4(),
    name: 'Tablet Ultra',
    category: 'Electronics',
    price: 649.99,
    stock: 40,
    description: 'Lightweight tablet with high-resolution display',
    createdAt: new Date('2023-06-18')
  },
  {
    id: uuidv4(),
    name: 'Digital Camera',
    category: 'Photography',
    price: 799.99,
    stock: 25,
    description: 'Professional digital camera with 4K video',
    createdAt: new Date('2023-07-22')
  },
  {
    id: uuidv4(),
    name: 'Gaming Console',
    category: 'Gaming',
    price: 499.99,
    stock: 35,
    description: 'Next-generation gaming console',
    createdAt: new Date('2023-08-30')
  }
];