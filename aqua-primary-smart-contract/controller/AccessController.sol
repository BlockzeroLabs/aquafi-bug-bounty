// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessController is AccessControl {
    
    address public aquaPremiumContract;
    address public oracleContract;
    bytes32 public constant CONTRACT_CONTROLLER = keccak256("CONTRACT_CONTROLLER");
    bytes32 public constant PREMIUM_CONTROLLER = keccak256("PREMIUM_CONTROLLER");

    mapping(address => mapping(address => bool)) public handlerToContract;

    event OracleAddressUpdated(address oldAddress, address newAddress);
    event PremiumContractUpdated(address oldAddress, address newAddress);
    event HandlerUpdated(address handler, address contractAddress, bool status);
    event ControllerContractUpdated(address oldAddress, address newAddress);

    constructor(address timelock) {
        _setupRole(CONTRACT_CONTROLLER, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, timelock);
    }

    function updateAquaPremiumAddress(address newAquaPremiumContract) external onlyRole(CONTRACT_CONTROLLER) {
        emit PremiumContractUpdated(aquaPremiumContract, newAquaPremiumContract);
        aquaPremiumContract = newAquaPremiumContract;
    }

    function updateOracleAddress(address newOracleAddress) external onlyRole(CONTRACT_CONTROLLER) {
        emit OracleAddressUpdated(oracleContract, newOracleAddress);
        oracleContract = newOracleAddress;
    }

    function updateHandler(address[] calldata handler, address[] calldata contractAddress)
        external
        onlyRole(CONTRACT_CONTROLLER)
    {
        require(handler.length == contractAddress.length, "Access controller :: Invalid Args.");
        for (uint8 i = 0; i < handler.length; i++) {
            handlerToContract[handler[i]][contractAddress[i]] = !handlerToContract[handler[i]][contractAddress[i]];
            emit HandlerUpdated(handler[i], contractAddress[i], handlerToContract[handler[i]][contractAddress[i]]);
        }
    }
}
