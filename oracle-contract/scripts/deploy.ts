// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ContractFactory, Contract, Wallet } from 'ethers'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import AquaPrimary from '../artifacts/contracts/AquaPrimary.sol/AquaProtocol.json'
// import UniswapHandler from '../artifacts/contracts/handlers/uniswap/UniswapHandler.sol/UniswapHandler.json'
// import AquaPremium from '../artifacts/contracts/aqua-premium/AquaPremiumContract.sol/AquaPremiumContract.json'
// import TimelockContract from '../artifacts/contracts/timelock-controller/AquaTimelockController.sol/AquaTimelockController.json';
import { Printer } from "prettier";

async function getAddres() {
  const [deployer] = await ethers.getSigners()
  console.log(deployer.address)

  const oracle = await ethers.getContractFactory("V2Oracle");
  const greeter = await oracle.deploy(
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    "0xF7a63a49FEf8015eB45a0D4e60d1bd8EAeE14cDD",
    "0x21fcf41D7C48B2a5fF70503Bf579FA34AAb72394",
    3600
  );
  console.log("Address => ",greeter.address)
  let tx = await greeter.fetchAquaPrice();
  console.log(tx)
  // const o = oracle.attach("0x51195385e42372300471Db5B064B5894C794A0e9");
  // let tx = await o.fetch("0x5d3069CBb2BFb7ebB9566728E44EaFDaC3E52708","0x");
  // let tx = await o.fetchAquaPrice();
  // console.log(tx.hash)
}

// async function predictAddress() {
//   const [liquidityProvider] = await ethers.getSigners()
//   let nonce = await liquidityProvider.getTransactionCount();
//   let address = await ethers.utils.getContractAddress({from: liquidityProvider.address, nonce})
//   console.log(address)
// }

// async function deployPrimary(): Promise<void> {
//   // Hardhat always runs the compile task when running scripts through it.
//   // If this runs in a standalone fashion you may want to call compile manually
//   // to make sure everything is compiled
//   // await run("compile");

//   // We get the contract to deploy

//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

//   const factory = new ContractFactory(
//     AquaPrimary.abi,
//     AquaPrimary.bytecode,
//     liquidityProvider
//   );
//   // 
//   let tx = await factory
//     .deploy(
//       '0xD8E187A1436026C278C60F3190895f850238bDC7', '0x3431cd240843cdd7c1c756a9851912a303275588', '0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F','0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F',
//       {
//         gasLimit: 3000000,
//       }
//     )
//   console.log(tx.hash)
// }

// async function deployUniHandler(): Promise<void> {

//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

//   const factory = new ContractFactory(
//     UniswapHandler.abi,
//     UniswapHandler.bytecode,
//     liquidityProvider
//   );
//   let tx = await factory
//     .deploy(
//       '0xf559ce78632a4609c5770faab92f10aead04bc49', '0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F',
//       {
//         gasLimit: 3000000,
//       }
//     )

//   console.log(tx)

// }

// async function deployAquaPremiumContract(): Promise<void> {

//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

//   const factory = new ContractFactory(
//     AquaPremium.abi,
//     AquaPremium.bytecode,
//     liquidityProvider
//   );
//   let tx = await factory
//     .deploy(
//       '1000', '0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F',
//       {
//         gasLimit: 3000000,
//       }
//     )

//   console.log(tx)

// }

// async function deployTimelockContract(): Promise<void> {

//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

//   const factory = new ContractFactory(
//     UniswapHandler.abi,
//     UniswapHandler.bytecode,
//     liquidityProvider
//   );
//   let tx = await factory
//     .deploy(
//       '0x97a58ab811a74a6a4cbf3deb7fbe7f5ad4f73094', '0x057d80180f20f7A0143EcE6a92F466db41e9A5c2',
//       {
//         gasLimit: 3000000,
//       }
//     )

//   console.log(tx)

// }

// async function getPremimumAddress() {
//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

//   const AquaFactory = new ContractFactory(
//     AquaPrimary.abi,
//     AquaPrimary.bytecode,
//     liquidityProvider
//   );

//   const AquaContract = await AquaFactory.attach("0xf559ce78632a4609c5770faab92f10aead04bc49")

//   console.log((await AquaContract.owner()).toString())
// } 



getAddres()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });



