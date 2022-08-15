from brownie import accounts, network, config
TESTNET_BLOCKCHAIN_ENVIRONMENTS = ['rinkeby', 'kovan', 'mumbai']


def get_account():
    print(len(accounts))
    if network.show_active() in TESTNET_BLOCKCHAIN_ENVIRONMENTS:
        return accounts.add(config["wallets"]['from_key'])
    return accounts[0]
