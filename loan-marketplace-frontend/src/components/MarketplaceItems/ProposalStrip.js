import {
  getSigner,
  invokeLend,
} from "../../contract-info/contract-interactions";
import { hexToInt, formatEther, secondsToDays } from "../../utils";
import "./Strip.css";

const ProposalStrip = ({ attributes }) => {
  const [, id, loanAmount, interestRate, loanDuration, , borrower, , , , ,] =
    attributes;

  const lend = async () => {
    const signerAddress = await getSigner().getAddress();
    if (borrower !== signerAddress) {
      await invokeLend(id, loanAmount);
      return;
    }
    alert("lend: Cannot lend to your own proposal");
  };

  return (
    <>
      <section className="strip-container">
        <table>
          <thead>
            <tr>
              <th>Proposed Amount</th>
              <th>Interest Rate</th>
              <th>Loan Duration</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatEther(loanAmount)}</td>
              <td>{hexToInt(interestRate)}%</td>
              <td>{hexToInt(secondsToDays(loanDuration))} Days</td>
              <td>{borrower} </td>
            </tr>
          </tbody>
        </table>
        <button className="strip-btn" onClick={lend}>
          Lend
        </button>
      </section>
    </>
  );
};

export default ProposalStrip;
