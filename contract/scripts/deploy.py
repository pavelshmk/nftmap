from brownie import accounts, NFTToken, RewardToken, Contract


def main():
    deployer = accounts.load('deployer')
    rt: Contract = RewardToken.deploy({'from': deployer})
    nft: Contract = NFTToken.deploy(rt.address, {'from': deployer})
    rt.transferOwnership(nft.address, {'from': deployer})
    RewardToken.publish_source(rt)
    NFTToken.publish_source(nft)
