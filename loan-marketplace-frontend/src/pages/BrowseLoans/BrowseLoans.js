import { useBrowseMarketItems } from "../../hooks/useBrowseMarketItems";
import ReactLoading from "react-loading";
import ProposalStrip from "../../components/MarketplaceItems/ProposalStrip";
import FractLoanStrip from "../../components/MarketplaceItems/FractLoanStrip";
import "../PagesGlobal.css";
import { useEffect } from "react";
import { getSigner } from "../../contract-info/contract-interactions";

const BrowseLoans = () => {
  const { proposals, fractLoans, isFetching } = useBrowseMarketItems();

  return (
    <>
      {isFetching ? (
        <div className="loading-screen">
          <ReactLoading type="cylon" width={"25%"} />
        </div>
      ) : (
        <div className="page-container">
          <div className="market-item-container">
            <h1 className="heading">Loan Proposals</h1>
            <section className="market-items">
              {proposals.map((proposalAttributes, index) => {
                return (
                  <ProposalStrip key={index} attributes={proposalAttributes} />
                );
              })}
            </section>
          </div>
          <div className="market-item-container">
            <h1 className="heading">Fractional Loans</h1>
            <section className="market-items">
              {fractLoans.map((fractLoan, idx) => {
                return (
                  <FractLoanStrip
                    key={idx}
                    fractSaleAttributes={fractLoan[10]}
                    fractLoanAttributes={fractLoan}
                  />
                );
              })}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default BrowseLoans;
