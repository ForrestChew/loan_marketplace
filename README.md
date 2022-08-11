# Peer to Peer Loan Marketplace
This peer to peer lending platform gives borrowers an opportunity to propose loans, and gives lenders the ability to fill them. Once a proposal is filled, the lender has the right to sell, that loan to a third party. The lender also has the option to sell a fractional percent of the loan they have lent to, however, the lender may only sell one fractional portion of their loan per loan they have lent to. This was done for security purposes. If a third party buys a fractional loan (or full loan), they become a lender to that loan, and have the same privilages to that loan as the original lender. 

# Setup Steps
### 1) Clone Repository
```
git clone https://github.com/ForrestChew/loan_marketplace.git
```
### 2) Install Eth-Brownie <br>
https://pypi.org/project/eth-brownie/
```
pipx install eth-brownie
```
### 3) Create `.env` file
If running the project locally (Ganache), skip this step. Otherwise, create a `.env` file in the root of project directory and add your private key. 
### 4) Deploy Smart Contract
```
brownie run scripts/deploy_contract --network <NAME_OF_NETWORK_TO_DEPLOY_TO>
```
Information on preset networks can by running the command:
```
brownie networks list
```
### 5) Install Front-End Dependencies
Change directory into `loan-marketplace-frontend` and run the command:
```
npm install
```
### 6) Obtain Smart Contract Build Info
In the `build` folder located in the root directory, obtain the smart contracts address, and it's ABI and add it to the `root/loan-marketplace-frontend/src/contract-info/contract-info.js` folder. The contract address and ABI will enable the front-end to communicate with the smart contract.
### 7) Start Front-End
Run the command: 
```
npm start
```
### 8) Test smart contract
To run tests on the Loan Marketplace smart contract, run the command
```
brownie test
```
To run with coverage:
```
brownie test -C
```
