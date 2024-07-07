// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

contract Auction{
    mapping(address => uint) biddersData;
    uint public highestBidAmount;
    address public highestBidder;
    uint public startTime;
    uint public endTime;
    address public owner;
    // bool auctionEnded = false;
    // constructor(){
    //     owner=msg.sender;
    // }

    event AuctionEnded(address winner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyDuringBidding() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Bidding is not allowed at this time");
        _;
    }

    modifier onlyAfterBidding() {
        require(block.timestamp > endTime, "Auction is not yet ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        startTime = block.timestamp ; // Set start time to the next occurrence of the specified hour
        endTime = startTime + 2 minutes;
    }




    //put new bid
    function putBid() public payable onlyDuringBidding{
        uint calculateAmount = biddersData[msg.sender]+msg.value;

        //require(block.timestamp>endTime,"Auction is ended"); //not func after end time
        require(msg.value>0,"Bid Value Cannot Be 0");//verify bid not 0
        require(calculateAmount>highestBidAmount,"Higher Bid available");//verify highest bid
        biddersData[msg.sender] = calculateAmount;
        highestBidAmount = calculateAmount;
        highestBidder = msg.sender;
    }
    // Get highest bidder address
    function getHighestBidder() public view returns (address) {
        return highestBidder;
    }
        // Get highest bidder amount
    function getHighestBidAmount() public view returns (uint) {
        return highestBidAmount;
    }



    // //get Contract Balance (test)
    // function getBidderBid(address _address) public view returns(uint){
    //     return biddersData[_address];
    // }

    // //get Highest BidAmount
    // function HighestBid() public view returns(uint){
    //     return highestBidAmount;
    // }

    // //get Highest Bidder Address
    // function HighestBidder() public view returns(address){
    //     return highestBidder;
    // }

    // //put endTime
    // function putEndTime(uint _endTime) public {
    //     endTime= _endTime;
    // }

    // //endAuction
    // function endAuction() public {
    //     if(msg.sender==owner){
    //         auctionEnded = true;
    //     }
    // }

    //withdraw bid
//     function withdrawBid(address payable _address) public  {
//         if(biddersData[_address]>0){
//             _address.transfer(biddersData[_address]);
//         }
//     }
// }

function withdrawBid(address payable _address) public onlyAfterBidding {
        require(biddersData[_address] > 0, "Bidder did not place a bid");
        _address.transfer(biddersData[_address]);
    }

    function endAuction() public onlyOwner onlyAfterBidding {
        emit AuctionEnded(highestBidder, highestBidAmount);
    }
}