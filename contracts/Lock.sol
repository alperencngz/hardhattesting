// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Token.sol";

contract Lock {
    BEEToken Token;
    uint256 public lockerCount;
    uint256 public totalLocked;
    mapping (address => uint256) public lockers;
    // kullanıcıların kitlenen tokenlarının açılma zamanı için bir mapping
    // burada struct kullanıp kullanıcıların token sayısı ve açılma zamanını onla yazabilirdik, better
    mapping (address => uint256) public deadline;

    constructor(address tokenAddress) {
        Token = BEEToken(tokenAddress);
    }

    function lockTokens(uint256 amount, uint256 time) external {
        require(amount > 0, "Token amount must be > 0.");

        // require(Token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        // require(Token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        // this controls is being done by ERC20 so don't need to add them and spend gas

        if(!(lockers[msg.sender] > 0)) lockerCount++;
        totalLocked += amount;
        lockers[msg.sender] += amount;
        deadline[msg.sender] = block.timestamp + time;

        bool ok = Token.transferFrom(msg.sender, address(this), amount);
        require(ok, "Transfer failed");

    }

    function withdrawTokens() external {
        require(lockers[msg.sender] > 0, "Not enough token.");
        require(block.timestamp >= deadline[msg.sender]);
        uint256 amount = lockers[msg.sender];
        delete(lockers[msg.sender]);
        delete(deadline[msg.sender]);
        totalLocked -= amount;
        lockerCount--;

        require(Token.transfer(msg.sender, amount), "Transfer failed.");

    }
}