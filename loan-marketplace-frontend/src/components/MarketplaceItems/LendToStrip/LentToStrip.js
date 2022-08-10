import { useState, useEffect } from "react";
import SellLoanForm from "./SellLoanForm";
import { getSigner } from "../../../contract-info/contract-interactions";
import { hexToInt, formatEther, getTimeRemaining } from "../../../utils";
import "../Strip.css";

const LentToStrip = ({ attributes }) => {
  const [percentOwnedValue, setPercentOwnedValue] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [
    ,
    id,
    loanAmount,
    interestRate,
    loanDuration,
    loanStartTime,
    borrower,
    lenders,
    percentOwned,
    ,
    ,
  ] = attributes;

  useEffect(() => {
    (async () => {
      const signerAddress = await getSigner().getAddress();
      lenders.forEach((lender, index) => {
        if (lender === signerAddress) {
          setPercentOwnedValue(percentOwned[index]);
        }
      });
    })();
    (async () => {
      setHoursRemaining(await getTimeRemaining(loanStartTime, loanDuration));
    })();
  }, []);

  return (
    <>
      <section className="strip-container">
        <table>
          <thead>
            <tr>
              <th>Percent Owned</th>
              <th>Loan Amount</th>
              <th>Interest Rate</th>
              <th>Loan Duration</th>
              <th>Borrower</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{hexToInt(percentOwnedValue)}%</td>
              <td>{formatEther(loanAmount)}</td>
              <td>{hexToInt(interestRate)}%</td>
              <td>{hoursRemaining} Hours</td>
              <td>{borrower} </td>
            </tr>
          </tbody>
        </table>
        <SellLoanForm loanId={id} />
      </section>
    </>
  );
};

export default LentToStrip;
