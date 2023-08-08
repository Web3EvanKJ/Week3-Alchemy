import { Alchemy, Network } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [showContent, setShowContent] = useState(false);
  const [blockTx, setBlockTx] = useState();
  const [NFT, setNFT] = useState();
  const [floor, setFloor] = useState();
  const [formData, setFormData] = useState("");
  const [realResult, setRealResult] = useState("");
  const [balance, setBalance] = useState("");

  async function getBalances(wallet) {
    try {
      const response = await alchemy.core.getBalance(wallet);
      setBalance(response._hex);
    } catch (err) {
      console.log(err);
    }
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setFormData(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRealResult(formData);
    setFormData(""); // Clear the form input
    getBalances(realResult);
    setBalance("");
  };

  async function getBlockNumber() {
    setBlockNumber(await alchemy.core.getBlockNumber());
  }

  async function getNFTFloor() {
    let NFTcontractAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
    let NFTtokenId = "8888";
    const NFTmetaData = await alchemy.nft.getNftMetadata(
      NFTcontractAddress,
      NFTtokenId
    );
    const fPrice = await alchemy.nft.getFloorPrice(NFTcontractAddress);
    setNFT(NFTmetaData.rawMetadata.image);
    setFloor(fPrice.openSea.floorPrice);
  }

  async function getBlockTransaction() {
    setBlockTx(await alchemy.core.getBlock());
  }

  useEffect(() => {
    getBlockNumber();
    getBlockTransaction();
    getNFTFloor();
  }, []);

  return (
    <div>
      <div
        onClick={() => {
          setShowContent(true);
        }}
        className="App"
      >
        Block Number: {blockNumber}
      </div>
      <div>
        <p>BAYC Floor Price : {floor ? floor : "Loading..."}</p>
        <p>BAYC #8888 Floor Price : {NFT}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="formInput">Enter a value:</label>
        <input
          type="text"
          id="formInput"
          value={formData}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {balance && (
        <p>{(parseInt(balance) / 1000000000000000000).toString()} ETH</p>
      )}
      {showContent && (
        <div className="App">
          List Of Transaction: <br />
          <ul>
            {blockTx.transactions.map((tx, index) => {
              return (
                <li key={index}>
                  <Link to={`/transactions/${tx}`}>{tx}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
