// SPDX-License-Identifier: MIT
pragma solidity solidity ^0.8.18;

import "./Token.sol";

contract Lock () {
    BEEToken Token;
    uint256 public lockerCount;
    uint256 public totalLocked;
    mapping (address => uint256) public lockers;

    constructor(address tokenAddress) {
        Token = BEEToken(tokenAddress);
    }

    function lockTokens(uint256 amount) external {
        require(amount > 0, "Token amount must be > 0.");

        // require(Token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        // require(Token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        // this controls is being done by ERC20 so don't need to add them and spend gas

        if(!(lockers[msg.sender] > 0)) lockerCount++;
        totalLocked += amount;
        lockers[msg.sender] += amount;

        bool ok = Token.transferFrom(msg.sender, address(this), amount);
        require(ok, "Transfer failed");

    }

    function withdrawTokens() external {
        require(lockers[msg.sender] > 0, "Not enough token.");
        uint256 amount = lockers[msg.sender];
        delete(lockers[msg.sender]);
        totalLocked -= amount;
        lockerCount--;

        require(Token.transfer(msg.sender, amount), "Transfer failed.");

    }
}