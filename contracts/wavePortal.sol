// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    event newWave(address indexed waver, string message, uint256 timestamp);

    uint256 totalWaves;

    uint256 private seed;

    mapping(address => uint256) public wavedAt;

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");

        seed = block.timestamp + block.difficulty;
    }

    function wave(string memory _message) public {
        require(
            wavedAt[msg.sender] + 5 seconds < block.timestamp,
            "please await 5s!"
        );
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));
        seed = (block.timestamp + block.difficulty + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prize = 0.0001 ether;

            require(
                prize <= address(this).balance,
                "insufficient amount of eth"
            );
            (bool result, ) = (msg.sender).call{value: prize}("");
            require(result, "withdraw error");
        }
        emit newWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
