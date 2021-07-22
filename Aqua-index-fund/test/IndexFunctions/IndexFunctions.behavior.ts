import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";
import { shouldBehaveLikeGetToken } from "../GetToken/getToken.behavior";
export async function shouldBehaveLikeIndexFunctions(
  wallets: SignerWithAddress[],
  indexFund: Contract,
  aquaToken: Contract,
  flashToken: Contract,
): Promise<void> {
  describe("TESTING GET TOKEN", async () => {
    await shouldBehaveLikeGetToken(indexFund, flashToken, aquaToken, wallets[0]);
  });
}
