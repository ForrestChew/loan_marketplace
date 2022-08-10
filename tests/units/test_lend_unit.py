import brownie
from web3 import Web3
from brownie import accounts

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_lending_without_sending_funds(contract, propose_loan):
    lender = accounts[2]
    non_existant_proposal_id = 1
    with brownie.reverts("lend: Non-existant proposal"):
        contract.lend(non_existant_proposal_id, {"from": lender})


def test_lend_proposal_time_start(contract, lend):
    proposal_id = contract.getMarketItemIds()[0]
    print(contract.getMarketplaceItems)
    proposal_time_start = contract.getMarketplaceItems(proposal_id)[5]
    assert proposal_time_start > 1


def test_lend_proposal_new_lender_percent_of_loan(contract, lend):
    lender = accounts[2]
    proposal_id = proposal_id = contract.getMarketItemIds()[0]
    lenders_percent_amount = contract.getMarketplaceItems(proposal_id)[8][0]
    assert lenders_percent_amount == 100


def test_lend_proposal_new_lender_assigned_to_loan(contract, lend):
    lender = accounts[2]
    proposal_id = contract.getMarketItemIds()[0]    
    lenders_assigned_to_loan = contract.getMarketplaceItems(proposal_id)[7][0]
    assert lenders_assigned_to_loan == lender


def test_lend_loan_made_to_proposer(lend):
    borrower = accounts[1]
    lender = accounts[2]
    assert borrower.balance() > lender.balance()


def test_emitted_lend_event(lend):
    emitted_lend_event = lend.events[0]
    assert emitted_lend_event


def test_emitted_lend_event_id(lend):
    emitted_proposal_event_id = lend.events[0]['id']
    assert emitted_proposal_event_id


def test_emitted_lend_event_id(lend):
    emitted_proposal_event_lender = lend.events[0]['lender']
    assert emitted_proposal_event_lender
