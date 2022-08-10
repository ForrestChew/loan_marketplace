import pytest
from brownie import LoanMarketplace,  accounts
from scripts.deploy_contract import get_account


@pytest.fixture()
def contract():
    owner = get_account()
    listing_fee = 1
    contract_instance = LoanMarketplace.deploy(owner, listing_fee, {"from": owner})
    return contract_instance


@pytest.fixture
def propose_loan(contract):
    loan_amount = 1
    interest_rate = 2
    loan_duration = 3
    borrower = accounts[1]
    proposal_tx = contract.proposeLoan(loan_amount, interest_rate, loan_duration, {
        "from": borrower, "value": 1})
    return proposal_tx


@pytest.fixture
def lend(contract, propose_loan):
    lender = accounts[2]
    proposal_id = contract.getMarketItemIds()[0]
    loan_amount = contract.getMarketplaceItems(proposal_id)[2]
    lend_tx = contract.lend(
        proposal_id, {"from": lender, "value": loan_amount})
    return lend_tx


@pytest.fixture
def payoff_debt_setup(contract):
    borrower = accounts[1]
    lender = accounts[2]
    listingFee = 1
    loan_amount = 10000
    interest_rate = 5
    contract.proposeLoan(loan_amount, interest_rate, 20, {
                         "from": borrower, "value": listingFee})
    proposal_id = contract.getMarketItemIds()[0]
    lend_tx = contract.lend(proposal_id, {"from": lender, "value": 10000})
    return lend_tx


@pytest.fixture
def sell_loan_fraction(contract, payoff_debt_setup):
    lender = accounts[2]
    loan_id = contract.getMarketItemIds()[0]
    sell_loan_fract_tx = contract.proposeLoanFraction(
        loan_id, 1, 50, {"from": lender})
    return sell_loan_fract_tx


@pytest.fixture
def payoff_debt(contract, payoff_debt_setup):
    borrower = accounts[1]
    loan_amount = 10000
    interest_rate = 5
    interest_amount = (loan_amount * (interest_rate * 100)) / 10000
    total_debt = loan_amount + interest_amount
    proposal_id = contract.getMarketItemIds()[0]
    payoff_debt_tx = contract.payoffDebt(
        proposal_id, {"from": borrower, "value": total_debt})
    return payoff_debt_tx
