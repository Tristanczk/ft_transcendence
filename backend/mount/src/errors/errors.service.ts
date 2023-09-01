import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErrorsService {
    //return true si erreur pas grave, false sinon
    handleErrorCodePrisma(error: any): boolean {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                console.error('Erreur - Aucun element trouve');
                return true;
            }
        }
        return false;
    }
}
