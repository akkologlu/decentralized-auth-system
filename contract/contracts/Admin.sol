// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public admin;
    mapping(address => bool) public admins;
    mapping(address => bool) public verifiedUsers;

    modifier onlyAdmin() {
        require(msg.sender == admin || admins[msg.sender], "Only admins can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
        admins[msg.sender] = true;
    }

    function addAdmin(address newAdmin) public onlyAdmin {
        admins[newAdmin] = true;
    }

    function verifyUser(address user) public onlyAdmin {
        verifiedUsers[user] = true;
    }

    function isUserVerified(address user) public view returns (bool) {
        return verifiedUsers[user];
    }

    function checkAdmin(address adminAdress) public view returns (bool) {
        return admins[adminAdress];
    }

    function getAdminAdress () public view returns (address) {
        return admin;
    }
}
