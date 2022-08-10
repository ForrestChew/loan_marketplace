import { useState, useEffect } from "react";
import { hexToInt, formatEther, getTimeRemaining } from "../../utils";
import "./Strip.css";

const ResellStrip = ({ attributes, fractSaleAttributes }) => {
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [, price, percentage] = fractSaleAttributes[0];
  const [
    ,
    ,
    loanAmount,
    interestRate,
    loanDuration,
    loanStartTime,
    borrower,
    ,
    ,
    ,
    ,
  ] = attributes;

  useEffect(() => {
    (async () => {
      setHoursRemaining(await getTimeRemaining(loanStartTime, loanDuration));
    })();
  });

  return (
    <>
      <section className="strip-container">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Percent of Loan</th>
              <th>Original Amount</th>
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
      </section>
    </>
  );
};

export default ResellStrip;
