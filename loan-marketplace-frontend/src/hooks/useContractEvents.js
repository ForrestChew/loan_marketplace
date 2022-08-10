import { useEffect } from "react";
import {
  getProvider,
  getContractInstance,
} from "../contract-info/contract-interactions";

const getCurrentBlockNum = async () => {
  const currentBlock = await getProvider().getBlock();
  return currentBlock.number;
};

export const useContractEvents = (fcToExecute) => {
  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on(
      "LoanProposalCreated",
      async (loanAmt, interestRate, loanDuration, borrower, e) => {
        if ((await getCurrentBlockNum()) === e.blockNumber) {
          fcToExecute();
        }
      }
    );
    return () => loanMarketplace.removeListener("LoanProposalCreated");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("ProposalDelisted", async (id, e) => {
      if ((await getCurrentBlockNum()) === e.blockNumber) {
        fcToExecute();
      }
    });
    return () => loanMarketplace.removeListener("ProposalDelisted");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("Lend", async (id, lender, e) => {
      if ((await getCurrentBlockNum()) === e.blockNumber) {
        fcToExecute();
      }
    });
    return () => loanMarketplace.removeListener("Lend");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("NewLoanFraction", async (id, percent, price, e) => {
      if ((await getCurrentBlockNum()) === e.blockNumber) {
        fcToExecute();
      }
    });
    return () => loanMarketplace.removeListener("NewLoanFraction");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on(
      "LoanFractionSold",
      async (id, buyer, percent, price, e) => {
        if ((await getCurrentBlockNum()) === e.blockNumber) {
          fcToExecute();
        }
      }
    );
    return () => loanMarketplace.removeListener("LoanFractionSold");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("DebtPaid", async (id, totalDebt, e) => {
      if ((await getCurrentBlockNum()) === e.blockNumber) {
        fcToExecute();
      }
    });
    return () => loanMarketplace.removeListener("DebtPaid");
  }, []);
};
