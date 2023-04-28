const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.provider;

//Bu fonksiyon tokenları her seferinde formatlayıp bignumbera çevirmek yerine
//Decimalları otomatik atıp stringleri de sayıya çevirecek bir fonksiyon
function ethToNum(val) {
    return Number(ethers.utils.formatEther(val));
}


describe("Lock Contract", function () {

    let owner, user1, user2;
    let Token, token;
    let Lock, lock;

    let balances;

    // before, beforeEach, after, afterEach, it

    before(async function() {
        // içinde genelde contractlar deploy edilir

        [owner, user1, user2] = await ethers.getSigners();

        Token = await ethers.getContractFactory("BEEToken");
        token = await Token.connect(owner).deploy();

        Lock = await ethers.getContractFactory("Lock");
        lock = await Lock.connect(owner).deploy(token.address);

        token.connect(owner).transfer(user1.address, ethers.utils.parseUnits("100", 18));
        token.connect(owner).transfer(user2.address, ethers.utils.parseEther("50"));

        token.connect(user1).approve(lock.address, ethers.constants.MaxUint256);
        token.connect(user2).approve(lock.address, ethers.constants.MaxUint256);
    });

    beforeEach(async function() {
        balances = [
            ethToNum(await token.balanceOf(owner.address)),
            ethToNum(await token.balanceOf(user1.address)),
            ethToNum(await token.balanceOf(user2.address)),
            ethToNum(await token.balanceOf(lock.address))
        ]
    })

    it("Deploys the contracts", async function() {
        // these 2 are kind of same controls ?
        expect(token.address).to.not.be.undefined;
        expect(lock.address).to.be.properAddress;
    });

    it("Sends tokens", async function() {
        expect(balances[1]).to.be.equal(100);
        expect(balances[2]).to.be.equal(50);

        expect(balances[0]).to.be.greaterThan(balances[1]);
    })

    it("Approves", async function() {
        let allowances = [
            await token.allowance(user1.address, lock.address),
            await token.allowance(user2.address, lock.address)
        ]

        expect(allowances[0]).to.be.equal(ethers.constants.MaxUint256);
        expect(allowances[0]).to.be.equal(allowances[1]);

    })

    describe("Contract Functions", function() {
        // describe içinde describe -> ilkinde kontratı,
        // ikincisinde kontratın fonksiyonlarını kontrol ediyoruz


    })

})