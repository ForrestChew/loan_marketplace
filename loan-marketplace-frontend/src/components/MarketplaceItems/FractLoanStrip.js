import { useState, useEffect } from "react";
import {
  getSigner,
  invokeBuyLoanFraction,
} from "../../contract-info/contract-interactions";
import { formatEther, hexToInt, getTimeRemaining } from "../../utils";

const FractLoanStrip = ({ fractSaleAttributes, fractLoanAttributes }) => {
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [idx, price, percentage, seller] = fractSaleAttributes[0];
  const [
    ,
    loanId,
    loanAmount,
    interestRate,
    loanDuration,
    loanStartTime,
    borrower,
    ,
    ,
    fractSaleIds,
    ,
  ] = fractLoanAttributes;

  useEffect(() => {
    (async () => {
      setHoursRemaining(await getTimeRemaining(loanStartTime, loanDuration));
    })();
  });

  const buyLoanFraction = async () => {
    const signerAddress = await getSigner().getAddress();
    const fractSaleId = await fractSaleIds[idx];
    if (signerAddress !== seller) {
      await invokeBuyLoanFraction(seller, fractSaleId, loanId, price);
      return;
    }
    alert("buyLoanFraction: Cannot buy your own market item");
  };

  return (
    <>
      <section className="strip-container">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Percent of Loan</th>
              <th>Full Loan Amount</th>
              <th>Interest Rate</th>
              <th>Loan Duration</th>
              <th>Borrower</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatEther(price)}</td>
              <td>{hexToInt(percentage)}%</td>
              <td>{formatEther(loanAmount)}</td>
              <td>{hexToInt(interestRate)}%</td>
              <td>{hoursRemaining} Hours</td>
              <td>{borrower} </td>
            </tr>
          </tbody>
        </table>
        <button className="strip-btn" onClick={buyLoanFraction}>
          Buy
        </button>
      </section>
    </>
  );
};

export default FractLoanStrip;
