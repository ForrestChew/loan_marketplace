import brownie
from brownie import accounts


def test_contract_deployment(contract):
    zero_address = '0x'.ljust(42, '0')
    assert contract.address != zero_address


def test_loan_marketplace_owner_assignment(contract):
    owner = accounts[0]
    assert contract.owner() == owner


def test_loan_marketplace_fee_assignment(contract):
    listing_fee = 1
    assert contract.listingFee() == listing_fee


def test_proposing_a_loan_without_paying_fee(contract):
    loan_amount = 1
    interest_rate = 2
    loan_duration = 3
    borrower = accounts[1]
    with brownie.reverts('proposeLoan: Listing fee required'):
        contract.proposeLoan(loan_amount, interest_rate,
                             loan_duration, {"from": borrower})


def test_proposing_a_loan(contract, propose_loan):
    assert contract.getMarketItemIds()


def test_listing_fee_payment(contract, propose_loan):
    assert contract.balance() == 1


def test_proposal_amount(contract, propose_loan):
    loan_amount = 1
    proposal_id =  contract.getMarketItemIds()[0]
    assert contract.getMarketplaceItems(proposal_id)[2] == loan_amount


def test_proposal_interest_rate(contract, propose_loan):
    interest_rate = 2
    proposal_id =  contract.getMarketItemIds()[0]
    assert contract.getMarketplaceItems(proposal_id)[3] == interest_rate


def test_proposal_duration(contract, propose_loan):
    loan_duration = 3 * 86400
    proposal_id = contract.getMarketItemIds()[0]
    print(contract.getMarketplaceItems(proposal_id))
    assert contract.getMarketplaceItems(proposal_id)[4] == loan_duration


def test_proposal_start_time(contract, propose_loan):
    start_time = 0
    proposal_id =  contract.getMarketItemIds()[0]
    assert contract.getMarketplaceItems(proposal_id)[5] == start_time


def test_proposal_borrower(contract, propose_loan):
    borrower = accounts[1]
    proposal_id = contract.getMarketItemIds()[0]
    assert contract.getMarketplaceItems(proposal_id)[6] == borrower


def test_emitted_proposal_event(propose_loan):
    emitted_proposal_event = propose_loan.events[0]
    assert emitted_proposal_event
    

def test_emitted_proposal_event_loan_amount(propose_loan):
    loan_amount = 1
    emitted_proposal_event_loan_amount = propose_loan.events[0]['loanAmount']
    assert emitted_proposal_event_loan_amount == loan_amount


def test_emitted_proposal_event_interest_rate(propose_loan):
    interest_rate = 2
    emitted_proposal_event_interest_rate = propose_loan.events[0]['interestRate']
    assert emitted_proposal_event_interest_rate == interest_rate


def test_emitted_proposal_event_loan_duration(propose_loan):
    loan_duration = 3
    emitted_proposal_event_loan_duration = propose_loan.events[0]['loanDuration']
    assert emitted_proposal_event_loan_duration == loan_duration


def test_emitted_proposal_event_borrower(propose_loan):
    borrower = accounts[1]
    emitted_proposal_event_borrower = propose_loan.events[0]['borrower']
    assert emitted_proposal_event_borrower == borrower
