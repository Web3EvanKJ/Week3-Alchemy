import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function Transaction() {
  const [txInfo, setTxInfo] = useState();

  const { transactionId } = useParams();

  async function transactionInfo(transactionId) {
    setTxInfo(await alchemy.core.getTransaction(transactionId));
  }

  useEffect(() => {
    transactionInfo(transactionId);
  }, []);

  return (
    <div>
      <Link to={"/"}>Go Back To HomePage</Link>
      <h2>Transaction Details for Transaction ID: {transactionId}</h2>
      {txInfo && (
        <>
          <h4>From : {txInfo.from}</h4>
          <h4>To : {txInfo.to}</h4>
          <h4>
            Value :{" "}
            {(parseInt(txInfo.value._hex) / 1000000000000000000).toString()} ETH
          </h4>
          <h4>
            Gas Price :{" "}
            {(parseInt(txInfo.gasPrice._hex) / 1000000000).toString()} Gwei
          </h4>
        </>
      )}
    </div>
  );
}

export default Transaction;
