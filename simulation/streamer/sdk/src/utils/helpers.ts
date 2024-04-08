import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'

export function getStationAddressSync(
    programId: PublicKey,
    id: string
): PublicKey {
    let stationAddressSync = PublicKey.findProgramAddressSync(
        [Buffer.from(anchor.utils.bytes.utf8.encode('station')), Buffer.from(id)],
        programId
    )[0]
    console.log("Station Address: ", stationAddressSync)
    return stationAddressSync
}
