import { PrismaClient } from '@prisma/client';
import createUserData from './testdata/userData';

export default async function create() {
  const prisma = new PrismaClient();
  await createUserData(prisma);
}
