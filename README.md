# Peer to Peer Loan Marketplace
This peer to peer lending platform gives borrowers an opportunity to propose loans, and gives lenders the ability to fill them. Once a proposal is filled, the lender has the right to sell, that loan to a third party. The lender also has the option to sell a fractional percent of the loan they have lent to, however, the lender may only sell one fractional portion of their loan per loan they have lent to. This was done for security purposes. If a third party buys a fractional loan (or full loan), they become a lender to that loan, and have the same privilages to that loan as the original lender. 

# Setup Steps
1) Clone Repository
```
git clone https://github.com/ForrestChew/loan_marketplace.git
```
2) Install Eth-Brownie <br>
https://pypi.org/project/eth-brownie/
```
pipx install eth-brownie
```
3) Create `.env` file
If running the project locally (Ganache), skip this step. Otherwise, create a `.env` file in the root of project directory and add your private key. 
4
