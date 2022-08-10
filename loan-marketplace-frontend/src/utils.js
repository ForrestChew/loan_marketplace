import { ethers } from "ethers";
import { getProvider } from "./contract-info/contract-interactions";

const hexToInt = (hexNum) => {
  let convertedHexNum = 0;
  try {
    convertedHexNum = Number(hexNum);
  } catch (e) {
    console.log(e);
  }
  return convertedHexNum;
};

const formatEther = (numToFormat) => {
  let formattedNum = 0;
  try {
    formattedNum = ethers.utils.formatEther(numToFormat);
  } catch (e) {
    console.log(e);
  }
  return formattedNum;
};

const secondsToDays = (seconds) => {
  let days = 0;
  try {
    days = seconds / 86400;
  } catch (e) {
    console.log(e);
  }
  return days;
};

const getTimeRemaining = async (loanStartTime, loanDuration) => {
  let currentTime = (await getProvider().getBlock()).timestamp;
  let diffTime = currentTime - loanStartTime;
  let hours = parseInt((hexToInt(loanDuration) - diffTime) / 60 / 60);
  return hours;
};

export { hexToInt, formatEther, secondsToDays, getTimeRemaining };
