import { Connection } from '@solana/web3.js';
import { Devolt } from './types/devolt';
import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
export default class DevoltClient {
    connection: Connection;
    wallet: Wallet;
    provider: AnchorProvider;
    program: Program<Devolt>;
    constructor(connection: Connection, wallet: Wallet);
    batteryReport({ id, latitude, longitude, maxCapacity, batteryLevel }: {
        id: string;
        latitude: number;
        longitude: number;
        maxCapacity: number;
        batteryLevel: number;
    }): Promise<void>;
    getStation(id: string): Promise<void>;
}
export declare const convertSecretKeyToKeypair: (key: string) => web3.Keypair;
