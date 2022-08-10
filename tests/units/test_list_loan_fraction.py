import brownie
from brownie import accounts


def test_list_loan_fraction_more_than_owned(contract, lend):
    lender = accounts[2]
    loan_id = contract.getMarketItemIds()[0]
    with brownie.reverts("proposeLoanFraction: Cant sell more than owned"):
        contract.proposeLoanFraction(loan_id, 1, 200, {"from": lender})


def test_list_loan_fraction(contract, sell_loan_fraction):
    loan_id = contract.getMarketItemIds()[0]
    fract_sale = contract.getMarketplaceItems(loan_id)[9][0]
    assert fract_sale > 1


def test_list_loan_fraction_price(contract, sell_loan_fraction):
    loan_id = contract.getMarketItemIds()[0]
    fract_sale_price = contract.getMarketplaceItems(loan_id)[10][0][1]
    assert fract_sale_price == 1


def test_list_loan_fraction_percent(contract, sell_loan_fraction):
    loan_id = contract.getMarketItemIds()[0]
    fract_sale_percent = contract.getMarketplaceItems(loan_id)[10][0][2]
    assert fract_sale_percent == 50


def test_list_loan_fraction_emitted_id(contract, sell_loan_fraction):
    loan_id = contract.getMarketItemIds()[0]
    emitted_fraction_listing_id = sell_loan_fraction.events[0]['loanId']
    assert loan_id == emitted_fraction_listing_id


def test_list_loan_fraction_emitted_percentage(sell_loan_fraction):
    emitted_fraction_listing_percentage = sell_loan_fraction.events[0]['percentage']
    assert emitted_fraction_listing_percentage == 50


def test_list_loan_fraction_emitted_price(sell_loan_fraction):
    emitted_fraction_listing_price = sell_loan_fraction.events[0]['price']
    assert emitted_fraction_listing_price == 1
