// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MedBooking} from "../src/MedBooking.sol";

contract DeployMedBooking is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MedBooking medBooking = new MedBooking();
        
        console.log("MedBooking deployed at:", address(medBooking));
        console.log("Owner:", medBooking.owner());
        
        vm.stopBroadcast();
    }
}

contract DeployMedBookingLocal is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        
        MedBooking medBooking = new MedBooking();
        
        console.log("MedBooking deployed at:", address(medBooking));
        console.log("Owner:", medBooking.owner());
        
        vm.stopBroadcast();
    }
}

