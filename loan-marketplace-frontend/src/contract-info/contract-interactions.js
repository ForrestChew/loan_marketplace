import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contract-info";
import { hexToInt } from "../utils";

const getProvider = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
};

const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return signer;
};

// Pass in a signer to get write access to the smart contract.
// Pass in a provider to get read only access to the smart contract.
const getContractInstance = (providerOrSigner) => {
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    providerOrSigner
  );
  return contractInstance;
};

const invokeProposeLoan = async (loanAmount, interestRate, duration) => {
  const listingFee = ethers.utils.parseEther("1");
  const signer = getSigner();
  const contract = getContractInstance(signer);
  await contract.proposeLoan(loanAmount, interestRate, duration, {
    value: listingFee,
  });
};

const invokeDelistProposal = async (loanId) => {
  const signer = getSigner();
  const contract = getContractInstance(signer);
  await contract.delistProposal(loanId);
};

const invokeLend = async (proposalId, loanAmount) => {
  const signer = getSigner();
  const contract = getContractInstance(signer);
  await contract.lend(proposalId, { value: loanAmount });
};

const invokeProposeLoanFraction = async (loanId, price, percentage) => {
  const signer = getSigner();
  const contract = getContractInstance(signer);
  await contract.proposeLoanFraction(
    loanId,
    ethers.utils.parseEther(price),
    percentage
  );
};

const invokeBuyLoanFraction = async (
  seller,
  fractSaleId,
  loanId,
  fractSalePrice
) => {
  const signer = getSigner();
  const contract = getContractInstance(signer);
  console.log(hexToInt(fractSalePrice));
  await contract.buyLoanFraction(seller, fractSaleId, loanId, {
    value: fractSalePrice.toString(),
  });
};

const invokePayoffDebt = async (loanId, totalDebt) => {
  const signer = getSigner();
  const contract = getContractInstance(signer);
  await contract.payoffDebt(loanId, { value: totalDebt });
};

const callGetMarketItemIds = async () => {
  const provider = getProvider();
  const contract = getContractInstance(provider);
  return await contract.getMarketItemIds();
};

const callGetMarketplaceItems = async (loanId) => {
  const provider = getProvider();
  const contract = getContractInstance(provider);
  return await contract.getMarketplaceItems(loanId);
};

const callGetTotalDebt = async (loanId) => {
  const provider = getProvider();
  const contract = getContractInstance(provider);
  return await contract.getTotalDebt(loanId);
};

export {
  getSigner,
  getProvider,
  getContractInstance,
  invokeProposeLoan,
  invokeDelistProposal,
  invokeLend,
  invokeBuyLoanFraction,
  invokePayoffDebt,
  invokeProposeLoanFraction,
  callGetMarketItemIds,
  callGetMarketplaceItems,
  callGetTotalDebt,
};
