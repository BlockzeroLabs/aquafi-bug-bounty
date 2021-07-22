import IndexFundArtifact from "../artifacts/contracts/IndexFund.sol/IndexFund.json";
import { deployContract } from "ethereum-waffle";
import ERC20Artifact from "../artifacts/contracts/test/ERC20.sol/ERC20.json";
import AquaTokenArtifact from "./AquaTokenArtifact/AquaToken.json";

export async function deployStubIndexFund(deployer: any): Promise<any> {
  const IndexFund = await deployContract(deployer, IndexFundArtifact);
  return IndexFund;
}

export async function deployStubFlash(deployer: any): Promise<any> {
  const flash = await deployContract(deployer, ERC20Artifact, ["Flash", "FLASH"]);
  return flash;
}

export async function deployStubAqua(deployer: any): Promise<any> {
  const aqua = await deployContract(deployer, AquaTokenArtifact, [
    "0x725C680A72C71A5D5E0351DC0455689E6B268Cf5",
    "0x0dF68B34E567A6E867F296E73C82b9546Da437f1",
  ]);
  return aqua;
}

export async function deployStubUsdt(deployer: any): Promise<any> {
  const usdt = await deployContract(deployer, ERC20Artifact, ["Usdt", "USDT"]);
  return usdt;
}
