const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03d085b595c97eb8f4623190e67ca1b5d65bf9489560061b9f5c542da5be419d7f": 100,
  // private key:e0c943b7e05d4f8ff41cecf55194cc56094bff76a1aec4c8a27a97d8c17e1ff1
  "0353184970410910b206157054347735a741c88adfab97d6e9695f6dabe4286d00": 50,
  //private key:8ae36db2ae9a3130745777c2d5ae6f966e48a9d1b7aec82012cc1f642f413dc3
  "0372af26281f8f26d0a0271dc02b1365726ffd7047de82ccdbc162b71051c4f4a9": 75,
  //private key:cc1311069eabacc7843530e72709c963a3662d9912bf1f84873316e7ac83391e

};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount, signature, recovery } = req.body;




  try {

    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);


    const publicKey = secp256k1.recoverPublicKey(hash, sig, recovery);




    if (toHex(publicKey) !== sender) {
      res.status(400).send({ message: "signature is not valid" });
    }


    setInitialBalance(sender);
    setInitialBalance(recipient);


    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message)
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
