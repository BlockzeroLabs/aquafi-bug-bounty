// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./controller/AccessController.sol";
import "./interfaces/IERC20Mintable.sol";
import "./interfaces/IAquaPremium.sol";
import "./interfaces/IHandler.sol";
import "./interfaces/IAuqaPrimary.sol";
import "./interfaces/IOracle.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AquaProtocol is IAuqaPrimary, AccessController {
    using SafeERC20 for IERC20Mintable;

    address public AQUA_TOKEN;
    address public WETH;
    address public aquaContractController;

    struct Stake {
        uint256 lpValue;
        uint256 depositTime;
        uint256 aquaPremium;
        address staker;
        address handler;
        address contractAddress;
    }

    mapping(bytes32 => Stake) public stakes;

    event Staked(
        bytes32 id,
        uint256 lpValue,
        uint256 depositTime,
        uint256 aquaPremium,
        address staker,
        address handler,
        address contractAddress,
        bytes data
    );
    event Unstaked(
        bytes32 id,
        uint256 tokenIdOrAmount,
        uint256 aquaPremium,
        uint256 aquaAmount,
        address[] token,
        uint128[] tokenDiff,
        bytes data
    );

    constructor(
        address newAquaPremiumContract,
        address newOracleContract,
        address timelock,
        address weth,
        address aqua
    ) AccessController(timelock) {
        
        aquaPremiumContract = newAquaPremiumContract;

        emit PremiumContractUpdated(address(0), newAquaPremiumContract);

        oracleContract = newOracleContract;

        emit OracleAddressUpdated(address(0), newOracleContract);

        WETH = weth;

        AQUA_TOKEN = aqua;
    }

    function stake(
        uint256 tokenIdOrAmount,
        address handler,
        address contractAddress,
        bytes calldata data
    ) external override {
        require(handlerToContract[handler][contractAddress] == true, "Aqua primary :: Invalid pool");

        address staker = msg.sender;

        IERC20Mintable(contractAddress).safeTransferFrom(staker, handler, tokenIdOrAmount);

        _stake(tokenIdOrAmount, staker, handler, contractAddress, data);
    }

    function _stake(
        uint256 tokenValue,
        address staker,
        address handler,
        address contractAddress,
        bytes calldata data
    ) internal {
        uint256 depositTime = block.timestamp;

        uint256 premium = IAquaPremium(aquaPremiumContract).getAquaPremium();

        bytes32 id = keccak256(abi.encodePacked(tokenValue, depositTime, premium, staker, contractAddress, handler));

        require(stakes[id].staker == address(0), "Aqua Primary :: stake already exists");

        stakes[id] = Stake(tokenValue, depositTime, premium, staker, handler, contractAddress);

        IHandler(handler).update(id, tokenValue, contractAddress, data);

        emit Staked(id, tokenValue, depositTime, premium, staker, handler, contractAddress, data);
    }

    function unstake(bytes32[] calldata id, uint256[] calldata tokenValue) external override {
        uint256 fees = 0;

        for (uint8 i = 0; i < id.length; i++) {
            fees = fees + _unstake(id[i], tokenValue[i]);
        }

        IERC20Mintable(AQUA_TOKEN).mint(msg.sender, fees);
    }

    function unstakeSingle(bytes32 id, uint256 tokenValue) external override {
        uint256 amount = _unstake(id, tokenValue);

        IERC20Mintable(AQUA_TOKEN).mint(msg.sender, amount);
    }

    function _unstake(bytes32 id, uint256 tokenValue) private returns (uint256 aquaAmount) {
        Stake memory s = stakes[id];

        require(s.staker == msg.sender, "Aqua primary :: Invalid stake");
        require(tokenValue <= s.lpValue, "Aqua Primary :: Invalid token amount");

        address[] memory token = new address[](2);
        uint128[] memory tokenDiff = new uint128[](2);

        bytes memory data;
        uint256 aquaPoolPremium;

        (token, aquaPoolPremium, tokenDiff, data) = IHandler(s.handler).withdraw(id, tokenValue, s.contractAddress);

        uint256 aquaFees;
        uint256 aquaPremium;

        for (uint8 i = 0; i < token.length; i++) {
            if (token[i] == WETH) {
                uint256 AQUAPerEth = IOracle(oracleContract).fetchAquaPrice();
                aquaAmount += (tokenDiff[i] * AQUAPerEth) / 1e18;
            } else if (token[i] != AQUA_TOKEN) {
                uint256 AQUAperToken = IOracle(oracleContract).fetch(token[i], data);
                aquaAmount += (tokenDiff[i] * AQUAperToken) / 1e18;
            } else {
                aquaAmount += tokenDiff[i];
            }
        }

        {
            (aquaFees, aquaPremium) = IAquaPremium(aquaPremiumContract).calculatePremium(
                s.depositTime,
                s.aquaPremium,
                aquaPoolPremium,
                aquaAmount
            );
        }

        if (s.lpValue == tokenValue) {
            delete stakes[id];
        } else {
            stakes[id].lpValue -= tokenValue;
        }

        emit Unstaked(id, tokenValue, aquaPremium, aquaFees, token, tokenDiff, data);

        return aquaAmount += aquaFees;
    }
}
