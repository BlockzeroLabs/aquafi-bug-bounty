// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ContractFactory, Contract, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import AquaPrimary from '../artifacts/contracts/AquaPrimary.sol/AquaProtocol.json'
// import UniswapHandler from '../artifacts/contracts/handlers/uniswap/UniswapHandler.sol/UniswapHandler.json'
// import AquaPremium from '../artifacts/contracts/aqua-premium/AquaPremiumContract.sol/AquaPremiumContract.json'
// import TimelockContract from '../artifacts/contracts/timelock-controller/AquaTimelockController.sol/AquaTimelockController.json';
// import { Printer } from "prettier";

// async function getAddres() {
//   const [liquidityProvider] = await ethers.getSigners()
//   console.log(liquidityProvider.address)

// }

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

async function deplotContract() {
  const [liquidityProvider] = await ethers.getSigners();
  console.log(liquidityProvider.address);

  const Library = await ethers.getContractFactory("PositionFee");
  const library = await Library.deploy();
  let lib = await library.deployed();

  const hand = await ethers.getContractFactory("UniswapHandlerV3", {
    libraries: {
      PositionFee: lib.address,
    },
  });

  let a = await hand.deploy(
    "0x906Ed66E685B0A7EEe4045843AAffC56D4326d52",
    "0x21fcf41D7C48B2a5fF70503Bf579FA34AAb72394",
    "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  );
  console.log(a.address);

  // let txs = hand.attach(a.address);
  // txs.update(
  //   "",
  //   "",
  //   "",
  //   ""
  // );
}

import {bytecode, linkReferences} from '../artifacts/contracts/UniswapHandlerV3.sol/UniswapHandlerV3.json'

function linkLibraries(
  {
    bytecode,
    linkReferences,
  }: {
    bytecode: string
    linkReferences: { [fileName: string]: { [contractName: string]: { length: number; start: number }[] } }
  },
  libraries: { [libraryName: string]: string }
): string {
  Object.keys(linkReferences).forEach((fileName) => {
    Object.keys(linkReferences[fileName]).forEach((contractName) => {
      if (!libraries.hasOwnProperty(contractName)) {
        throw new Error(`Missing link library name ${contractName}`)
      }
      const address = ethers.utils.getAddress(libraries[contractName]).toLowerCase().slice(2)
      linkReferences[fileName][contractName].forEach(({ start: byteStart, length: byteLength }) => {
        const start = 2 + byteStart * 2
        const length = byteLength * 2
        bytecode = bytecode
          .slice(0, start)
          .concat(address)
          .concat(bytecode.slice(start + length, bytecode.length))
      })
    })
  })
  return bytecode
}

console.log(
    linkLibraries({bytecode,linkReferences}, {PositionFee: ''})
)

// deplotContract()
//   .then(() => process.exit(0))
//   .catch((error: Error) => {
//     console.error(error);
//     process.exit(1);
//   });
