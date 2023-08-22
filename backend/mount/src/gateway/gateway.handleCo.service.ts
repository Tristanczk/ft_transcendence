import { Injectable } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';

export class GatewayConnectionService {
    async addNewConnection(socket: any) {
        console.log('nouveau');
        return '';
    }
}
