import { Connection, sendAndConfirmTransaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import bs58 from "bs58";
import dotenv from "dotenv";
import { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { Devolt, IDL } from "./types/devolt";

export const DEVOLT_PROGRAM_ID = "J2Q9o5k6FmZQjiCiuVoDST3u97qxvNPZujFgxcRL4Hho";

dotenv.config({ path: __dirname + "/.env" });

export function getStationAddressSync(
  programId: PublicKey,
  id: string
): PublicKey {
  let stationAddressSync = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("station")), Buffer.from(id)],
    programId
  )[0];
  return stationAddressSync;
}

export const convertSecretKeyToKeypair = (key: string) => {
  const secretKey = bs58.decode(key);

  return Keypair.fromSecretKey(secretKey);
};

export default class DevoltClient {
  connection: Connection;
  wallet: Wallet;
  provider: AnchorProvider;
  program: Program<Devolt>;

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      AnchorProvider.defaultOptions()
    );
    this.program = new Program<Devolt>(IDL, DEVOLT_PROGRAM_ID, this.provider);
  }

  async getAllStations() {
    console.log("\n\n\nFetching all stations...");
    const stations = await this.program.account.station.all();
    console.log("\nStations: ", stations);
    return stations;
  }

  async sendSolToStationPDA(id: string, amount: number) {
    console.log(`Sending ${amount} SOL to station ${id}...`);

    const encodedId = id;
    const StationPDA = getStationAddressSync(this.program.programId, encodedId);

    const txInstruction = web3.SystemProgram.transfer({
      fromPubkey: this.wallet.publicKey,
      toPubkey: StationPDA,
      lamports: amount,
    });

    const tx = new web3.Transaction().add(txInstruction);

    await sendAndConfirmTransaction(this.connection, tx, [this.wallet.payer]);
    console.log(`Successfully sent ${amount} LAMPORTS to station ${id}.`);
    console.log(
      `Station PDA Balance: ${await this.connection.getBalance(StationPDA)}`
    );
  }

  async batteryReport({
    id,
    latitude,
    longitude,
    maxCapacity,
    batteryLevel,
  }: {
    id: string;
    latitude: number;
    longitude: number;
    maxCapacity: number;
    batteryLevel: number;
  }) {
    const encodedId = id; // '3'
    const StationPDA = getStationAddressSync(this.program.programId, encodedId);
    const tx = await this.program.methods
      .batteryReport({
        id,
        latitude,
        longitude,
        maxCapacity,
        batteryLevel,
      })
      .accounts({ signer: this.wallet.publicKey, station: StationPDA })
      // .rpc()
      .transaction();

    let sign = await sendAndConfirmTransaction(this.connection, tx, [
      this.wallet.payer,
    ]);

    return sign;
  }

  async getStation(id: string) {
    const encodedId = id;
    const StationPDA = getStationAddressSync(this.program.programId, encodedId);
    const station = await this.program.account.station.fetch(StationPDA);
    return station;
  }
}

const secretArrayStr = process.env.SOLANA_KEY;
const secretArray = JSON.parse(secretArrayStr!);
const secret: Uint8Array = new Uint8Array(secretArray);
const secretHex: string = Array.from(secret)
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
const secretBase58: string = bs58.encode(Buffer.from(secretHex, "hex"));
const wallet = new Wallet(convertSecretKeyToKeypair(secretBase58));

const connection = new Connection("https://api.devnet.solana.com");

const devoltClient = new DevoltClient(connection, wallet);

export { devoltClient };
