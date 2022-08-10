import {
  getSigner,
  invokeDelistProposal,
} from "../../contract-info/contract-interactions";
import { hexToInt, formatEther } from "../../utils";
import "./Strip.css";

const ProposalStrip = ({ attributes }) => {
  const [, id, loanAmount, interestRate, loanDuration, , borrower, , , , ,] =
    attributes;

  const delistProposal = async () => {
    const signerAddress = await getSigner().getAddress();
    if (borrower === signerAddress) {
      await invokeDelistProposal(id);
      return;
    }
    alert("delistProposal: Cannot delist a proposal you have not proposed");
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
              <th>Proposer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatEther(loanAmount)}</td>
              <td>{hexToInt(interestRate)}%</td>
              <td>{hexToInt(loanDuration)} Days</td>
              <td>{borrower} </td>
            </tr>
          </tbody>
        </table>
        <button className="strip-btn" onClick={delistProposal}>
          Delist
        </button>
      </section>
    </>
  );
};

export default ProposalStrip;
