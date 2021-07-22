// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IERC20Burnable.sol";

contract IndexFund {
  using SafeERC20 for IERC20Burnable;
  uint256 private constant PRECISION = 10**18;
  address private constant AQUA_ADDRESS = 0x5F471E1C81412E3682207Cf36E9e69e8cFd0d886;
  mapping(bytes32 => bool) private withdraws;

  function getToken(address[] memory _tokenAddresses, uint256[] memory _aquaAmounts)
    external
  {
    uint256 aquaPercentage;
    uint256 tokenBalance;
    uint256 aquaSupply = IERC20(AQUA_ADDRESS).totalSupply();
    uint256 timestamp = block.timestamp;
    address payable sender = payable(msg.sender);
    address contractAddress = address(this);

    require(_tokenAddresses.length < 200, "IndexFund:: Batch limit exceeded"); // real limit to be decided

    for (uint256 i = 0; i < _tokenAddresses.length; i++) {
      bytes32 withdrawnId = keccak256(abi.encode(_tokenAddresses[i], sender, timestamp));
      require(withdraws[withdrawnId] == false, "IndexFund:: Token already withdrawn");
      aquaPercentage = (_aquaAmounts[i] * PRECISION) / aquaSupply;

      tokenBalance = _tokenAddresses[i] == address(0)
        ? contractAddress.balance
        : IERC20(_tokenAddresses[i]).balanceOf(contractAddress);

      IERC20Burnable(AQUA_ADDRESS).burnFrom(sender, _aquaAmounts[i]);
      uint256 tokenPercentageToTransfer = (tokenBalance * aquaPercentage) / PRECISION;
      
      withdraws[withdrawnId] = true;
      _tokenAddresses[i] == address(0)
        ? sender.transfer(tokenPercentageToTransfer)
        : IERC20Burnable(_tokenAddresses[i]).safeTransfer(
          sender,
          tokenPercentageToTransfer
        );
      aquaSupply = aquaSupply - _aquaAmounts[i];
    }
  }

  fallback() external payable {}
}
