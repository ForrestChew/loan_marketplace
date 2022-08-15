import { useState, useEffect } from "react";
import {
  callGetMarketItemIds,
  callGetMarketplaceItems,
  getSigner,
} from "../contract-info/contract-interactions";
import { useContractEvents } from "./useContractEvents";

export const useProfileItems = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [signerProposals, setSignerProposals] = useState([]);
  const [signersBorrowedLoans, setSignersBorrowedLoans] = useState([]);
  const [signerLentTo, setSignerLentTo] = useState([]);
  const [signerResellProposals, setSignerResellProposals] = useState([]);

  useEffect(() => {
    buildProfileItems();
    // eslint-disable-next-line
  }, []);

  const clearArrs = () => {
    setSignerProposals([]);
    setSignersBorrowedLoans([]);
    setSignerLentTo([]);
    setSignerResellProposals([]);
  };

  const buildProfileItems = async () => {
    clearArrs();
    const profileItemIds = await callGetMarketItemIds();
    profileItemIds.forEach(async (id) => {
      setProfileItemType(await callGetMarketplaceItems(id));
    });
    setTimeout(() => {
      setIsFetching(false);
    }, 400);
  };

  const setProfileItemType = async (item) => {
    const [, , , , , , borrower, lenders, , , fractSales] = item;
    const signerAddress = await getSigner().getAddress();
    let isFractSale;
    fractSales.forEach((fractSale) => {
      if (fractSale.seller === signerAddress) isFractSale = true;
    });
    if (borrower === signerAddress && !lenders.length) {
      setSignerProposals((signerProposals) => [...signerProposals, item]);
    } else if (lenders.includes(signerAddress)) {
      setSignerLentTo((signerLentTo) => [...signerLentTo, item]);
    }
    if (isFractSale) {
      setSignerResellProposals((signerResellProposals) => [
        ...signerResellProposals,
        item,
      ]);
    }
    if (borrower === signerAddress && lenders.length) {
      setSignersBorrowedLoans((signersBorrowedLoans) => [
        ...signersBorrowedLoans,
        item,
      ]);
    }
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", () => {
      buildProfileItems();
    });
  }, []);

  useContractEvents(buildProfileItems);

  return {
    signerProposals,
    signersBorrowedLoans,
    signerLentTo,
    signerResellProposals,
    isFetching,
  };
};
