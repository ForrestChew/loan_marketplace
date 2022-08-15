// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./LoanFactory.sol";

contract LoanMarketplace is LoanFactory {
    address public owner;
    uint256 public listingFee;

    mapping(address => bool) public isBlacklisted;

    event LoanProposalCreated(
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        address borrower
    );
    event ProposalDelisted(uint256 id);
    event Lend(uint256 id, address lender);
    event NewLoanFraction(uint256 loanId, uint256 percentage, uint256 price);
    event LoanFractionSold(
        uint256 loanId,
        address buyer,
        uint256 percentage,
        uint256 price
    );
    event DebtPaid(uint256 id, uint256 totalDebt);
    event Blacklisted(address blacklistedAddr, uint256 defaultedLoan);

    modifier isBlacklistedCheck() {
        require(
            !isBlacklisted[msg.sender],
            "isBlacklisted: Account is blacklisted"
        );
        _;
    }

    /**
     * @notice - Ran once on contract creation.
     * @param _owner - The address to be made owner. This
     * address will have rights to withdraw the listing fees.
     * @param _listingFee - The fee a user has to pay to list
     * their loan proposal.
     */
    constructor(address _owner, uint256 _listingFee) {
        owner = _owner;
        listingFee = _listingFee;
    }

    /**
     * @notice - Enables user to propose a loan.
     * @param _loanAmount - The amount a user wants to borrow.
     * @param _interestRate - The interest rate to pay back.
     * @param _loanDuration - The amount of time the borrower
     * has to payback the loan.
     */
    function proposeLoan(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) external payable isBlacklistedCheck {
        require(msg.value == listingFee, "proposeLoan: Listing fee required");
        createProposal(_loanAmount, _interestRate, _loanDuration);
        emit LoanProposalCreated(
            _loanAmount,
            _interestRate,
            _loanDuration,
            msg.sender
        );
    }

    /**
     * @notice - Allows user to delist a proposal.
     * @param _proposalId - Proposal ID to delist.
     */
    function delistProposal(uint256 _proposalId) public {
        require(
            itemIdToItem[_proposalId].id > 0,
            "delistProposal: Non-existant proposal"
        );
        deleteItem(_proposalId);
        emit ProposalDelisted(_proposalId);
    }

    /**
     * @notice - Allows a user to lend to a proposal.
     * @param _proposalId - The ID of the proposal a user wishes to lend to.
     */
    function lend(uint256 _proposalId) external payable isBlacklistedCheck {
        require(
            itemIdToItem[_proposalId].id > 0,
            "lend: Non-existant proposal"
        );
        require(
            msg.value == itemIdToItem[_proposalId].loanAmount,
            "lend: Incorrect Amount"
        );
        _sendFunds(itemIdToItem[_proposalId].borrower, msg.value);
        updateProposalOnLend(_proposalId);
        emit Lend(_proposalId, msg.sender);
    }

    /**
     * @notice - Enabels lenders to sell portions of their loan.
     * @param _loanId - ID of the loan a lender wishes to sell a fraction of.
     * @param _price - Price to sell the fraction for.
     * @param _percentage - Fraction of loan to sell.
     */
    function proposeLoanFraction(
        uint256 _loanId,
        uint256 _price,
        uint256 _percentage
    ) external {
        require(
            !_hasFractionalSale(_loanId),
            "proposeLoanFraction: Already have fractional sale"
        );
        require(
            _percentage <= itemIdToItem[_loanId].percentOwned[msg.sender],
            "proposeLoanFraction: Cant sell more than owned"
        );
        createFractSale(_loanId, _price, _percentage);
        emit NewLoanFraction(_loanId, _percentage, _price);
    }

    /**
     * @notice - Enabels users to buy fractions of loans sold by
     * active lenders.
     * @param _seller - Address of lender who is selling the fraction.
     * @param _fractSaleId - Key to the fractional loan sale info.
     * @param _loanId - ID of the loan that a fraction is being sold as.
     */
    function buyLoanFraction(
        address _seller,
        uint256 _fractSaleId,
        uint256 _loanId
    ) external payable isBlacklistedCheck {
        uint256 fractSalePrice = itemIdToItem[_loanId]
            .fractSales[_fractSaleId]
            .price;
        require(
            msg.value == fractSalePrice,
            "buyLoanFraction: Incorrect amount"
        );
        deleteFractSale(_loanId, _fractSaleId, _seller);
        uint256 fractSalePercent = itemIdToItem[_loanId]
            .fractSales[_fractSaleId]
            .percentage;
        emit LoanFractionSold(
            _loanId,
            msg.sender,
            fractSalePercent,
            fractSalePrice
        );
    }

    /**
     * @notice - Borrowers can payoff their loans.
     * @param _loanId - The ID of the loan to payback.
     */
    function payoffDebt(uint256 _loanId) external payable {
        uint256 totalDebt = getTotalDebt(_loanId);
        require(itemIdToItem[_loanId].id > 0, "payoffDebt: Non-existant loan");
        require(msg.value == totalDebt, "payoffDebt: Incorrect Amount");
        address[] memory lenders = itemIdToItem[_loanId].lenders;
        for (uint256 i = 0; i < lenders.length; i++) {
            uint256 percentOfLoan = itemIdToItem[_loanId].percentOwned[
                lenders[i]
            ];
            uint256 amountOwed = (totalDebt * (percentOfLoan * 100)) / 10000;
            _sendFunds(lenders[i], amountOwed);
        }
        deleteItem(_loanId);
        emit DebtPaid(_loanId, totalDebt);
    }

    /**
     * @notice - Prevents accounts from participating in the loan marketplace
     * if their address is blacklisted. An address can become blacklisted if
     * they default on a loan.
     * @param _toBlacklist - Address to be blacklisted.
     * @param _loanId - The defaulted loan.
     */
    function blacklistAddr(address _toBlacklist, uint256 _loanId) public {
        require(
            block.timestamp >=
                itemIdToItem[_loanId].loanStartTime +
                    itemIdToItem[_loanId].loanDuration,
            "blacklistAddr: Loan has not defaulted yet."
        );
        deleteItem(_loanId);
        isBlacklisted[_toBlacklist] = true;
        emit Blacklisted(_toBlacklist, _loanId);
    }

    /**
     * @notice - Owner address can withdraw listing fees from contract.
     */
    function ownerWithdraw() public {
        require(msg.sender == owner, "ownerWithdraw: Only Owner");
        (bool withdrawTx, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(withdrawTx, "Tx failed");
    }

    /**
     * @notice - Calculates the amount a borrower owes on their loan.
     * @param _loanId - The ID of the loan to calculate debt.
     * @return - The total amount a borrower owes. Base loan amount + interest rate.
     */
    function getTotalDebt(uint256 _loanId) public view returns (uint256) {
        uint256 loanAmount = itemIdToItem[_loanId].loanAmount;
        uint256 interestRate = itemIdToItem[_loanId].interestRate;
        uint256 totalInterest = (loanAmount * (interestRate * 100)) / 10000;
        uint256 totalDebt = loanAmount + totalInterest;
        return totalDebt;
    }

    /**
     * @notice - Gets current loan proposals.
     * @return - Array of loan proposal structs.
     */
    function getMarketplaceItems(uint256 _itemId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            FractSale[] memory
        )
    {
        Item storage item = itemIdToItem[_itemId];
        uint256[] memory loanOwnershipValue = new uint256[](
            item.lenders.length
        );
        for (uint256 i = 0; i < item.lenders.length; i++) {
            loanOwnershipValue[i] = item.percentOwned[item.lenders[i]];
        }
        FractSale[] memory fractSales = new FractSale[](
            item.fractSaleIds.length
        );
        for (uint256 j = 0; j < item.fractSaleIds.length; j++) {
            fractSales[j] = item.fractSales[item.fractSaleIds[j]];
        }
        return (
            item.idx,
            item.id,
            item.loanAmount,
            item.interestRate,
            item.loanDuration,
            item.loanStartTime,
            item.borrower,
            item.lenders,
            loanOwnershipValue,
            item.fractSaleIds,
            fractSales
        );
    }

    /**
     * @notice - Gets the each market item ID.
     * @return - An array containing all market item IDs.
     */
    function getMarketItemIds() public view returns (uint256[] memory) {
        return marketItemIds;
    }

    /**
     * @notice - Coordinates sending funds.
     * @param  _to - Account to receiving funds.
     * @param _amount - Amount of funds to send.
     */
    function _sendFunds(address _to, uint256 _amount) private {
        (bool sendFundsTx, ) = payable(_to).call{value: _amount}("");
        require(sendFundsTx, "_sendFunds: Tx Failed");
    }

    /**
     * @notice - Determines whether the calling address has a fractional
     * sale proposed on the marketplace.
     * @param _loanId - ID of the loan to propose a fractional sale on.
     */
    function _hasFractionalSale(uint256 _loanId) private view returns (bool) {
        uint256 fractSaleIds = itemIdToItem[_loanId].fractSaleIds.length;
        for (uint256 i = 0; i < fractSaleIds; i++) {
            if (
                itemIdToItem[_loanId]
                    .fractSales[itemIdToItem[_loanId].fractSaleIds[i]]
                    .seller == msg.sender
            ) {
                return true;
            }
        }
        return false;
    }
}
