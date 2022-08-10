import { useEffect, useState } from "react";
import {
  invokePayoffDebt,
  callGetTotalDebt,
  getSigner,
} from "../../contract-info/contract-interactions";
import { hexToInt, formatEther, getTimeRemaining } from "../../utils";

const SignerLoanStrip = ({ attributes }) => {
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [
    ,
    id,
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
    const interestAmount = (formatEther(loanAmount) * interestRate) / 100;
    setTotalDebt(interestAmount + Number(formatEther(loanAmount)));
  });

  const getTotalDebt = async () => {
    return callGetTotalDebt(id);
  };

  const payoffDebt = async () => {
    const signerAddress = await getSigner().getAddress();
    if (borrower === signerAddress) {
      await invokePayoffDebt(id, getTotalDebt());
      return;
    }
    alert("payoffDebt: Cannot payoff debt you do not owe.");
  };

  return (
    <>
      <section className="strip-container">
        <table>
          <thead>
            <tr>
              <th>Proposed Amount</th>
              <th>Interest Rate</th>
              <th>Total Debt</th>
              <th>Loan Duration</th>
              <th>My Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatEther(loanAmount)}</td>
              <td>{hexToInt(interestRate)}%</td>
              <td>{totalDebt}</td>
              <td>{hoursRemaining} Hours</td>
              <td>{borrower} </td>
            </tr>
          </tbody>
        </table>
        <button className="strip-btn" onClick={payoffDebt}>
          Payoff Debt
        </button>
      </section>
    </>
  );
};

export default SignerLoanStrip;
