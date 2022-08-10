import ReactLoading from "react-loading";
import { useProfileItems } from "../../hooks/useProfileItems";
import SignerProposalStrip from "../../components/MarketplaceItems/SignerProposalStrip";
import LentToStrip from "../../components/MarketplaceItems/LendToStrip/LentToStrip";
import ResellStrip from "../../components/MarketplaceItems/ResellStrip";
import SignerLoanStrip from "../../components/MarketplaceItems/SignerLoanStrip";
import "../PagesGlobal.css";
const Profile = () => {
  const {
    signerProposals,
    signersBorrowedLoans,
    signerLentTo,
    signerResellProposals,
    isFetching,
  } = useProfileItems();

  return (
    <>
      {isFetching ? (
        <div className="loading-screen">
          <ReactLoading type="cylon" width={"25%"} />
        </div>
      ) : (
        <div className="page-container">
          <div className="market-item-container">
            <h3 className="heading">My Loans</h3>
            <section className="market-items">
              {signersBorrowedLoans.map((signerAttributes, idx) => {
                return (
                  <SignerLoanStrip key={idx} attributes={signerAttributes} />
                );
              })}
            </section>
          </div>
          <div className="market-item-container">
            <h3 className="heading">Loans Lent To</h3>
            <section className="market-items">
              {signerLentTo.map((proposalAttributes, idx) => {
                return (
                  <LentToStrip key={idx} attributes={proposalAttributes} />
                );
              })}
            </section>
          </div>
          <div className="market-item-container ">
            <h3 className="heading">My Proposals</h3>
            <section className="market-items">
              {signerProposals.map((signerAttributes, idx) => {
                return (
                  <SignerProposalStrip
                    key={idx}
                    attributes={signerAttributes}
                  />
                );
              })}
            </section>
          </div>
          <div className="market-item-container ">
            <h3 className="heading">Resell Proposals</h3>
            <section className="market-items">
              {signerResellProposals.map((resellProposal, idx) => {
                return (
                  <ResellStrip
                    key={idx}
                    attributes={resellProposal}
                    fractSaleAttributes={resellProposal[10]}
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

export default Profile;
