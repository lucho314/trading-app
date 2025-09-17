// apps/backend/src/prisma/prisma.module.ts
import { PrismaService } from '@/prisma.service';
import { Global, Module } from '@nestjs/common';

@Global() // opcional → lo hace accesible en toda la app sin imports
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
