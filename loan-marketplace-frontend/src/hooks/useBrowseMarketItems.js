import { useState, useEffect } from "react";
import {
  callGetMarketplaceItems,
  callGetMarketItemIds,
} from "../contract-info/contract-interactions";
import { useContractEvents } from "./useContractEvents";

export const useBrowseMarketItems = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [fractLoans, setFractLoans] = useState([]);

  useEffect(() => {
    buildMarketItems();
  }, []);

  const clearArrs = () => {
    setProposals([]);
    setFractLoans([]);
  };

  const buildMarketItems = async () => {
    clearArrs();
    const mpItemIds = await callGetMarketItemIds();
    mpItemIds.forEach(async (itemId) => {
      const mpItem = await callGetMarketplaceItems(itemId);
      setProposalType(mpItem);
    });
    setTimeout(() => {
      setIsFetching(false);
    }, 400);
  };

  const setProposalType = async (item) => {
    const zeroAddress = "0x".padEnd(42, "0");
    const [, , , , , , borrower, lenders, , fractSaleIds, ,] = item;
    if (!lenders.length && !fractSaleIds.length && borrower !== zeroAddress) {
      setProposals((proposals) => [...proposals, item]);
    } else if (fractSaleIds.length) {
      setFractLoans((fractLoans) => [...fractLoans, item]);
    }
  };

  useContractEvents(buildMarketItems);

  return { proposals, fractLoans, isFetching };
};
