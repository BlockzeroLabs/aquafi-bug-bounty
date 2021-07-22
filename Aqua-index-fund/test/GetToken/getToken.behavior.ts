import { Contract } from "@ethersproject/contracts";
import { BigNumber, utils } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const ZERO_ADDRESS: string = "0x0000000000000000000000000000000000000000";
let aquaSupply: BigNumber;
let contractFlashBalance: BigNumber;
let userFLashBalance: BigNumber;
let userAquaBalance: BigNumber;
let aquaPercentage: BigNumber;
let flashToTransfer: BigNumber;
export async function shouldBehaveLikeGetToken(
  indexFund: Contract,
  flashToken: Contract,
  aquaToken: Contract,
  wallet0: SignerWithAddress,
): Promise<void> {
  
  it("Should fail with token already withdrawn", async function () {
    await aquaToken.approve(indexFund.address, utils.parseEther("900000000"));
    await flashToken.transfer(indexFund.address, utils.parseEther("20000000"));
    await expect(
      indexFund.getToken(
        [flashToken.address, flashToken.address],
        [utils.parseEther("200"), utils.parseEther("200")],
      ),
    ).to.be.revertedWith("IndexFund:: Token already withdrawn");
  });

  it("Should successfully transfer the tokens", async function () {
    await aquaToken.approve(indexFund.address, utils.parseEther("900000000"));

    await flashToken.transfer(indexFund.address, utils.parseEther("20000000"));

    aquaSupply = await aquaToken.totalSupply();

    contractFlashBalance = await flashToken.balanceOf(indexFund.address);

    userFLashBalance = await flashToken.balanceOf(wallet0.address);

    userAquaBalance = await aquaToken.balanceOf(wallet0.address);

    aquaPercentage = utils
      .parseEther("200")
      .mul(BigNumber.from(Math.pow(10, 18).toString()))
      .div(aquaSupply);

    userAquaBalance = userAquaBalance.sub(utils.parseEther("200"));

    aquaSupply = aquaSupply.sub(utils.parseEther("200"));

    flashToTransfer = contractFlashBalance
      .mul(aquaPercentage)
      .div(BigNumber.from(Math.pow(10, 18).toString()));

    userFLashBalance = userFLashBalance.add(flashToTransfer);

    contractFlashBalance = contractFlashBalance.sub(flashToTransfer);

    expect(await indexFund.getToken([flashToken.address], [utils.parseEther("200")]));
  });

  it("User flash balance should be correctly updated", async function () {
    expect(await flashToken.balanceOf(wallet0.address)).to.be.equal(
      BigNumber.from(userFLashBalance),
    );
  });

  it("User aqua balance should be correctly deducted", async function () {
    expect(await aquaToken.balanceOf(wallet0.address)).to.be.equal(
      BigNumber.from(userAquaBalance),
    );
  });

  it("Contract flash balance should be correcty deducted", async function () {
    expect(await flashToken.balanceOf(indexFund.address)).to.be.equal(
      contractFlashBalance,
    );
  });

  it("Aqua total supply should be correctly decreased after burn", async function () {
    expect(await aquaToken.totalSupply()).to.be.equal(aquaSupply);
  });

  it("Should successfully transfer ethers", async function () {
    wallet0.sendTransaction({
      from: wallet0.address,
      to: indexFund.address,
      value: utils.parseEther("1000"),
    });
    await aquaToken.approve(indexFund.address, utils.parseEther("900000000"));
    expect(await indexFund.getToken([ZERO_ADDRESS], [utils.parseEther("200")]));
  });
}
