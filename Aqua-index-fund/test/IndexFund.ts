import { use } from "chai";
import { utils, Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import IndexFundArtifact from "../artifacts/contracts/IndexFund.sol/IndexFund.json";
import {
  deployStubAqua,
  deployStubFlash,
  deployStubIndexFund,
  deployStubUsdt,
} from "./stubs";
import { shouldBehaveLikeIndexFunctions } from "./IndexFunctions/IndexFunctions.behavior";
import hre from "hardhat";
use(solidity);
describe("Testing IndexFund Contract", async () => {
  let indexFund: Contract;
  let aquaToken: Contract;
  let flashToken: Contract;
  let usdtToken: Contract;

  const [wallet0, wallet1, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();

  before("Initiating the tests", async () => {
    indexFund = await deployStubIndexFund(wallet0);
    aquaToken = await deployStubAqua(wallet0);
    await aquaToken.mint(wallet0.address, utils.parseEther("10000"));
    flashToken = await deployStubFlash(wallet0);
    usdtToken = await deployStubUsdt(wallet0);
  });

  describe("TESTING INDEX FUND FUNCTIONS", async () => {
    it("Testing Index Functions", async function () {
      await shouldBehaveLikeIndexFunctions(
        [wallet0, wallet1, wallet2, wallet3],
        indexFund,
        aquaToken,
        flashToken,
      );
    });
  });
});
