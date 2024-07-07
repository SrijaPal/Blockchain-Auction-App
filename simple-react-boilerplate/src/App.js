import React from "react";
import Web3 from "web3";
import Auction from "./static/Auction.json";
import Apples from "./static/apples.jpg";
import Banana from "./static/banana.jpg";
import Carrots from "./static/carrots.jpg";
import Onion from "./static/onion.jpg";
import Potato from "./static/potato.jpg";
import Watermelon from "./static/watermelon.jpg";
import Wheat from "./static/wheat.jpg";

var myContract;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hasMounted: false,
      itemBids: {}, // Store bid amounts for each item
      highestBidAmount: 0,
      highestBidder: "",
      showBidWarning: false,
    };
    this.changeBidAmount = this.changeBidAmount.bind(this);
  }

  async componentDidMount() {
    if (!this.state.hasMounted) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:7545")
      );
      console.log(await web3.eth.getAccounts());

      myContract = await new web3.eth.Contract(
        Auction.abi,
        Auction.networks[5777].address
      );

      //this.updateHighestBidInfo();
      this.setState({
        hasMounted: true,
      });
    }
  }

  async putBitFunc(e, itemName) {
    e.preventDefault();
    if (window.ethereum !== "undefined") {
      if (window.ethereum.selectedAddress) {
        const bidderAddress = window.ethereum.selectedAddress;
        const bidAmount = parseFloat(this.state.itemBids[itemName]) || 0;
        if (bidAmount <= 0) {
          // Show warning and return
          //this.setState({ showBidWarning: true });
          window.alert("Bid amount must be greater than 0");
          return;
        }
        console.log(Web3.utils.toWei(bidAmount, "ether"));

        try {
          console.log(
            await myContract.methods.putBid().send({
              from: bidderAddress,
              value: Web3.utils.toWei(bidAmount, "ether"),
              gas: 300000,
            })
          );

          // Update highest bid information after successful bid
          this.updateHighestBidInfo();
          window.alert(
            `Bid placed successfully.\nFrom Account : ${bidderAddress} Amount : ${bidAmount} Ethers`
          );
        } catch (error) {
          console.error("Error executing putBid:", error.message);
        }
      } else {
        console.log(
          await window.ethereum.request({ method: "eth_requestAccounts" })
        );
      }
    } else {
      console.log("Metamask not installed");
    }
  }

  changeBidAmount(e, itemName) {
    const newBids = { ...this.state.itemBids, [itemName]: e.target.value };
    this.setState({ itemBids: newBids });
  }

  async updateHighestBidInfo() {
    const highestBid = await myContract.methods.getHighestBidAmount().call();
    const highestBidder = await myContract.methods.getHighestBidder().call();

    this.setState({
      highestBidf: Web3.utils.fromWei(highestBid, "ether"),
      highestBidderf: highestBidder,
    });
  }

  render() {
    return (
      <div style={{ marginLeft: "40px", marginRight: "40px" }}>
        <div
          style={{
            margin: "0px auto",
            display: "flex",
            justifyContent: "center",
            flexFlow: "column",
            alignItems: "center",
            background: "#f0f0f0",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h1 style={{ color: "#333", marginBottom: "10px" }}>
            Auction BKT Project DAPP - Supply Chain{" "}
          </h1>
          <hr width="100%" size="2" color="blue" noshade="true"></hr>
        </div>
        {items.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              background: "#fff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              width={200}
              height={200}
              style={{ borderRight: "5px solid #ddd", objectFit: "cover" }}
            />
            <div style={{ marginLeft: "20px", padding: "20px", flex: 1 }}>
              <div style={{ color: "#333", fontWeight: "bold" }}>
                Item type: {item.type}
              </div>
              <div style={{ color: "#555" }}>Item name: {item.name}</div>
              <div style={{ color: "#555" }}>
                Item quantity: {item.quantity}
              </div>
            </div>
            <div style={{ marginLeft: "20px", padding: "20px" }}>
              <div>
                <input
                  style={{
                    width: "150px",
                    height: "50px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                  type="number"
                  placeholder="Bid (Eth)"
                  value={this.state.itemBids[item.name] || ""}
                  onChange={(e) => this.changeBidAmount(e, item.name)}
                />
                <button
                  style={{
                    fontSize: "16px",
                    height: "50px",
                    marginLeft: "10px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => this.putBitFunc(e, item.name)}
                >
                  Put Bid
                </button>
              </div>
              <div style={{ marginTop: "10px" }}>
                {this.state.showBidWarning && (
                  <p style={{ color: "red" }}>
                    Bid amount must be greater than 0
                  </p>
                )}
                <p>Highest Bid: {this.state.highestBidAmount} ETH</p>
                <p>Highest Bidder: {this.state.highestBidder}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;

const items = [
  { name: "Apples", type: "Fruit", quantity: "1 dozen", image: Apples },
  { name: "Banana", type: "Fruit", quantity: "1 dozen", image: Banana },
  { name: "Carrots", type: "Vegetable", quantity: "1 Kg", image: Carrots },
  { name: "Onion", type: "Vegetable", quantity: "1 Kg", image: Onion },
  { name: "Potato", type: "Vegetable", quantity: "1 Kg", image: Potato },
  { name: "Watermelon", type: "Fruit", quantity: "1 dozen", image: Watermelon },
  { name: "Wheat", type: "Crop", quantity: "10 Kg", image: Wheat },
];
