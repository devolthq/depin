"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSecretKeyToKeypair = void 0;
const web3_js_1 = require("@solana/web3.js");
const devolt_1 = require("./types/devolt");
const anchor_1 = require("@coral-xyz/anchor");
const program_1 = require("./constants/program");
const helpers_1 = require("./utils/helpers");
const web3_js_2 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
class DevoltClient {
    constructor(connection, wallet) {
        this.connection = connection;
        this.wallet = wallet;
        this.provider = new anchor_1.AnchorProvider(this.connection, this.wallet, anchor_1.AnchorProvider.defaultOptions());
        this.program = new anchor_1.Program(devolt_1.IDL, program_1.DEVOLT_PROGRAM_ID, this.provider);
        console.log("Program ID: ", this.program.programId);
    }
    batteryReport({ id, latitude, longitude, maxCapacity, batteryLevel }) {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedId = id; // '3'
            const StationPDA = (0, helpers_1.getStationAddressSync)(this.program.programId, encodedId);
            // console.log("Station PDA: ", StationPDA)
            const tx = yield this.program.methods
                .batteryReport({
                id,
                latitude,
                longitude,
                maxCapacity,
                batteryLevel
            })
                .accounts({ signer: this.wallet.publicKey, station: StationPDA })
                .rpc();
            console.log("\nTransaction data: ", tx);
            // const d = await this.program.account.station.fetch(StationPDA)
        });
    }
    getStation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedId = id; // '3'
            const StationPDA = (0, helpers_1.getStationAddressSync)(this.program.programId, encodedId);
            const station = yield this.program.account.station.fetch(StationPDA);
            console.log("\nStation: ", station);
        });
    }
}
exports.default = DevoltClient;
const convertSecretKeyToKeypair = (key) => {
    const secretKey = bs58_1.default.decode(key);
    return web3_js_2.Keypair.fromSecretKey(secretKey);
};
exports.convertSecretKeyToKeypair = convertSecretKeyToKeypair;
const secretArray = [
    59, 82, 131, 25, 97, 163, 16, 56, 89, 160, 64, 28, 241, 28, 188, 186, 21, 131,
    230, 113, 252, 100, 208, 60, 137, 240, 43, 85, 254, 217, 68, 149, 163, 5, 193,
    216, 243, 33, 223, 130, 145, 9, 117, 106, 254, 86, 171, 115, 255, 3, 202, 13,
    71, 103, 142, 162, 238, 169, 164, 211, 45, 242, 230, 132
];
const secret = new Uint8Array(secretArray);
const secretHex = Array.from(secret)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
const secretBase58 = bs58_1.default.encode(Buffer.from(secretHex, 'hex'));
const wallet = new anchor_1.Wallet((0, exports.convertSecretKeyToKeypair)(secretBase58));
console.log(wallet.publicKey.toBase58());
const a = new DevoltClient(new web3_js_1.Connection('https://api.devnet.solana.com'), wallet);
console.log("Caller: ", a.wallet.publicKey.toBase58());
function runInSequence() {
    return __awaiter(this, void 0, void 0, function* () {
        const id1 = '1';
        const latitude1 = Math.floor(Math.random() * 1000);
        const longitude1 = Math.floor(Math.random() * 1000);
        const maxCapacity1 = Math.floor(Math.random() * 1000);
        const batteryLevel1 = Math.floor(Math.random() * 100);
        console.log("\n\nInserting values for batteryReport 1:");
        console.log("id:", id1);
        console.log("latitude:", latitude1);
        console.log("longitude:", longitude1);
        console.log("maxCapacity:", maxCapacity1);
        console.log("batteryLevel:", batteryLevel1);
        yield a.batteryReport({
            id: id1,
            latitude: latitude1,
            longitude: longitude1,
            maxCapacity: maxCapacity1,
            batteryLevel: batteryLevel1
        });
        yield a.getStation('1');
        const id2 = '2';
        const latitude2 = Math.floor(Math.random() * 1000);
        const longitude2 = Math.floor(Math.random() * 1000);
        const maxCapacity2 = Math.floor(Math.random() * 1000);
        const batteryLevel2 = Math.floor(Math.random() * 100);
        console.log("\n\nInserting values for batteryReport 2:");
        console.log("id:", id2);
        console.log("latitude:", latitude2);
        console.log("longitude:", longitude2);
        console.log("maxCapacity:", maxCapacity2);
        console.log("batteryLevel:", batteryLevel2);
        yield a.batteryReport({
            id: id2,
            latitude: latitude2,
            longitude: longitude2,
            maxCapacity: maxCapacity2,
            batteryLevel: batteryLevel2
        });
        yield a.getStation('2');
    });
}
runInSequence();
// import * as anchor from '@coral-xyz/anchor'
// console.log(Buffer.from(anchor.utils.bytes.utf8.encode('station')).toString('hex'))
