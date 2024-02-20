
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils"

const privateKey = secp256k1.utils.randomPrivateKey()

console.log("privateKey", toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)

console.log("publicKey", toHex(publicKey))