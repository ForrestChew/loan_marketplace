// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract LoanFactory {
    struct Item {
        uint256 idx;
        uint256 id;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 loanStartTime;
        address borrower;
        address[] lenders;
        mapping(address => uint256) percentOwned;
        uint256[] fractSaleIds;
        mapping(uint256 => FractSale) fractSales;
    }
    struct FractSale {
        uint256 idx;
        uint256 price;
        uint256 percentage;
        address seller;
    }
    uint256[] marketItemIds;
    mapping(uint256 => Item) public itemIdToItem;

    /**
     * @notice - Creates the loan proposal structure by assiging
     * assigning an ID to it, then pushing that ID to an array,
     * in addition to keeping track of it's idx in the array. This
     * is done as the ID combined with it's idx can be used as
     * key with constant lookup time.
     * @param _loanAmount - The amount a user wants to borrow.
     * @param _interestRate - The interest rate for the loan.
     * @param _loanDuration - The amount of time the borrower
     * has to payback the loan.
     */
    function createProposal(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) internal {
        uint256 proposalId = _createHashedKey(_loanAmount, _interestRate);
        uint256 marketItemIdIdx = marketItemIds.length;
        itemIdToItem[proposalId].idx = marketItemIdIdx;
        itemIdToItem[proposalId].id = proposalId;
        itemIdToItem[proposalId].loanAmount = _loanAmount;
        itemIdToItem[proposalId].interestRate = _interestRate;
        /// @dev - Converts input days into seconds.
        itemIdToItem[proposalId].loanDuration = _loanDuration * 86400;
        itemIdToItem[proposalId].borrower = msg.sender;
        marketItemIds.push(proposalId);
    }

    /**
     * @notice - Updates a current loan proposal when someone
     * lends the full loan amount to the borrower.
     * @param _proposalId - The ID of the proposal to lend on.
     */
    function updateProposalOnLend(uint256 _proposalId) internal {
        itemIdToItem[_proposalId].loanStartTime = block.timestamp;
        itemIdToItem[_proposalId].lenders.push(msg.sender);
        itemIdToItem[_proposalId].percentOwned[msg.sender] = 100;
    }

    /**
     * @notice - Deletes the resolved proposal.
     * @param _proposalId - The ID of the proposal to delete.
     */
    function deleteItem(uint256 _proposalId) internal {
        uint256 loanToDeleteIdx = itemIdToItem[_proposalId].idx;
        if (marketItemIds.length >= 2) {
            marketItemIds[loanToDeleteIdx] = marketItemIds[
                marketItemIds.length - 1
            ];
            delete itemIdToItem[marketItemIds[loanToDeleteIdx]];
            marketItemIds.pop();
        } else {
            delete itemIdToItem[marketItemIds[loanToDeleteIdx]];
            marketItemIds.pop();
        }
    }

    /**
     * @notice - Creates a fract sale.
     * @param _loanId - ID of targeted loan.
     * @param _price - Amount to sell loan fraction for.
     * @param _percentage - Percent of loan to sell.
     */
    function createFractSale(
        uint256 _loanId,
        uint256 _price,
        uint256 _percentage
    ) internal {
        uint256 fractSaleId = _createHashedKey(_price, _percentage);
        uint256 fractSaleIdIdx = itemIdToItem[_loanId].fractSaleIds.length;
        itemIdToItem[_loanId].fractSaleIds.push(fractSaleId);
        itemIdToItem[_loanId].fractSales[fractSaleId].idx = fractSaleIdIdx;
        itemIdToItem[_loanId].fractSales[fractSaleId].price = _price;
        itemIdToItem[_loanId].fractSales[fractSaleId].percentage = _percentage;
        itemIdToItem[_loanId].fractSales[fractSaleId].seller = msg.sender;
    }

    function deleteFractSale(
        uint256 _loanId,
        uint256 _fractSaleId,
        address _seller
    ) public {
        _updateLoanOwnerPercents(_loanId, _fractSaleId, _seller);
        if (itemIdToItem[_loanId].fractSaleIds.length >= 2) {
            uint256 fractSaleIdIdx = itemIdToItem[_loanId]
                .fractSales[_fractSaleId]
                .idx;
            uint256 lastFractSaleIdIdx = itemIdToItem[_loanId]
                .fractSaleIds
                .length - 1;
            /**
             * @dev - Removes fract loan sale key by swapping values with
             * the end of the array and then popping the last value off the end.
             */
            itemIdToItem[_loanId]
                .fractSales[fractSaleIdIdx]
                .idx = lastFractSaleIdIdx;
            itemIdToItem[_loanId].fractSaleIds.pop();
            delete itemIdToItem[_loanId].fractSales[fractSaleIdIdx];
        } else {
            itemIdToItem[_loanId].fractSaleIds.pop();
            delete itemIdToItem[_loanId].fractSales[_fractSaleId];
        }
    }

    /**
     * @notice - Creates and returns a key by hashing 4 elements together.
     * @param _input1 - First user value to use for hash.
     * @param _input2 - Second user value to use for hash.
     * @return - Hash of four elements.
     */
    function _createHashedKey(uint256 _input1, uint256 _input2)
        private
        view
        returns (uint256)
    {
        bytes32 hashedElems = keccak256(
            abi.encodePacked(msg.sender, _input1, _input2, block.timestamp)
        );
        return uint256(hashedElems);
    }

    /**
     * @notice - Helper function responsible for adjusting the owned percents
     * of a loan.
     * @param _loanId - ID of the target loan.
     * @param _fractSaleId - ID of the fractional sale containing info
     * relevant to how loan percents get are shifted.
     * @param _seller - Address of the fractional sale seller.
     */
    function _updateLoanOwnerPercents(
        uint256 _loanId,
        uint256 _fractSaleId,
        address _seller
    ) private {
        uint256 fractSalePercent = itemIdToItem[_loanId]
            .fractSales[_fractSaleId]
            .percentage;
        itemIdToItem[_loanId].lenders.push(msg.sender);
        itemIdToItem[_loanId].percentOwned[_seller] -= fractSalePercent;
        itemIdToItem[_loanId].percentOwned[msg.sender] += fractSalePercent;
    }
}
