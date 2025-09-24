// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export async function userGetUserFromDb(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })



  if (!user) {
    return null
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}
