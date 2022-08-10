import { ethers } from "ethers";
import { useState } from "react";
import { invokeProposeLoanFraction } from "../../../contract-info/contract-interactions";
import "./SellLoanForm.css";

const SellLoanForm = ({ loanId }) => {
  const [fractLoanSale, setFractLoanSale] = useState({
    percentage: "",
    price: "",
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFractLoanSale({ ...fractLoanSale, [name]: value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    sellLoanFraction();
  };

  const sellLoanFraction = async () => {
    await invokeProposeLoanFraction(
      loanId,
      fractLoanSale.price.toString(),
      fractLoanSale.percentage
    );
  };

  return (
    <form className="resell-form" onSubmit={submitForm}>
      <input
        className="input-box"
        type="number"
        name="percentage"
        value={fractLoanSale.percentage}
        placeholder="Percentage"
        min={0}
        required
        onChange={handleInputChange}
      ></input>
      <input
        className="input-box"
        type="number"
        name="price"
        value={fractLoanSale.price}
        placeholder="Price"
        min={0}
        required
        onChange={handleInputChange}
      ></input>
      <button className="strip-btn" onClick={sellLoanFraction}>
        Sell
      </button>
    </form>
  );
};

export default SellLoanForm;
