import brownie
from brownie import accounts


def test_buy_loan_fraction(contract, sell_loan_fraction):
    fract_seller = accounts[2]
    fract_buyer = accounts[3]
    loan_id = contract.getMarketItemIds()[0]
    fract_key = contract.getMarketplaceItems(loan_id)[9][0]
    contract.buyLoanFraction(fract_seller, fract_key, loan_id, {
                             "from": fract_buyer, "value": 1})
    lenders = contract.getMarketplaceItems(loan_id)[7]
    print(lenders)
    assert lenders[0] == fract_seller
    assert lenders[1] == fract_buyer


def test_buy_loan_fraction_updates_fract_dist(contract, sell_loan_fraction):
    fract_seller = accounts[2]
    fract_buyer = accounts[3]
    loan_id = contract.getMarketItemIds()[0]
    fract_key = contract.getMarketplaceItems(loan_id)[9][0]
    contract.buyLoanFraction(fract_seller, fract_key, loan_id, {
                             "from": fract_buyer, "value": 1})
    buyer_percent_amt = contract.getMarketplaceItems(loan_id)[8][0]
    seller_percent_amt = contract.getMarketplaceItems(loan_id)[8][1]
    assert buyer_percent_amt == 50
    assert seller_percent_amt == 50


