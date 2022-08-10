import { useState, useEffect } from "react";
import {
  callGetMarketItemIds,
  callGetMarketplaceItems,
} from "../contract-info/contract-interactions";
import { useContractEvents } from "./useContractEvents";

export const useHomeItemCount = () => {
  const [mpInfoCounts, setMPInfoCounts] = useState({
    lenderCnt: 0,
    borrowerCnt: 0,
    proposalCnt: 0,
    loanCnt: 0,
    fractCnt: 0,
  });
  useEffect(() => {
    getMPItems();
    // eslint-disable-next-line
  }, []);

  const clearArr = () => {
    setMPInfoCounts({
      lenderCnt: 0,
      borrowerCnt: 0,
      proposalCnt: 0,
      loanCnt: 0,
      fractCnt: 0,
    });
  };

  const getMPItems = async () => {
    const itemIds = await callGetMarketItemIds();
    if (!itemIds.length) return;
    clearArr();
    itemIds.forEach(async (itemId) => {
      const item = await callGetMarketplaceItems(itemId);
      updateMPInfoCounters(item);
    });
  };

  const updateMPInfoCounters = async (item) => {
    const [, , , , , , borrower, lenders, , fractSaleIds, ,] = item;
    const zeroAddress = "0x".padEnd(42, "0");
    if (borrower !== zeroAddress && !lenders.length) {
      setMPInfoCounts((mpInfoCounts) => ({
        ...mpInfoCounts,
        proposalCnt: mpInfoCounts.proposalCnt + 1,
      }));
    } else if (lenders.length) {
      setMPInfoCounts((mpInfoCounts) => ({
        ...mpInfoCounts,
        lenderCnt: mpInfoCounts.lenderCnt + 1,
        loanCnt: mpInfoCounts.loanCnt + 1,
        borrowerCnt: mpInfoCounts.borrowerCnt + 1,
      }));
    }
    if (lenders.length && fractSaleIds.length) {
      setMPInfoCounts((mpInfoCounts) => ({
        ...mpInfoCounts,
        fractCnt: mpInfoCounts.fractCnt + 1,
      }));
    }
  };

  useContractEvents(getMPItems);

  return { mpInfoCounts };
};
