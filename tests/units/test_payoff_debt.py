import brownie
from brownie import accounts


def test_payoff_debt_incorrect_amount(contract, payoff_debt_setup):
    borrower = accounts[1]
    incorrect_debt_amount = 1
    proposal_id = contract.getMarketItemIds()[0]
    with brownie.reverts("payoffDebt: Incorrect Amount"):
        contract.payoffDebt(
            proposal_id, {"from": borrower, "value": incorrect_debt_amount})


def test_emitted_payoff_debt_event_id(payoff_debt):
    emitted_payoff_event_id = payoff_debt.events[0]['id']
    assert emitted_payoff_event_id != ""


