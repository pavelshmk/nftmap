import { injectable } from "inversify";
import { action, makeObservable, observable, runInAction } from "mobx";
import Web3 from 'web3';
import { RootStore } from "./RootStore";
import { ContractContext as RewardTokenContractContext } from '../utils/contracts/RewardToken';
import { ContractContext as NFTTokenContractContext } from '../utils/contracts/NFTToken';
import RewardTokenABI from '../utils/contracts/RewardToken.abi.json';
import NFTTokenABI from '../utils/contracts/NFTToken.abi.json';
import BN from "bignumber.js";
import { CHAIN_ID, NFT_TOKEN_CONTRACT, REWARD_TOKEN_CONTRACT, TEST_NETWORK } from "../utils/const";
import { toBNJS } from "../utils/utilities";


const chainParameters = TEST_NETWORK ? {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
} : {
    chainId: '0x38',
    chainName: 'BSC',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
}

if (window["ethereum"])
    window["ethereum"].autoRefreshOnNetworkChange = false;

@injectable()
export class WalletStore {
    private rawProvider = new Web3.providers.HttpProvider(chainParameters.rpcUrls[0]);

    @observable connected: boolean = false;
    @observable account?: string;
    @observable ethBalance?: BN;
    @observable rtBalance?: BN;
    @observable metamaskFound: boolean = false;

    public constructor(protected rootStore: RootStore) {
        this.metamaskFound = !!window["ethereum"];
        makeObservable(this);
    }

    @action resetWallet = async (chainId?: string) => {
        if (parseInt(chainId, 16) == CHAIN_ID)
            return;
        this.connected = false;
        this.rawProvider = new Web3.providers.HttpProvider(chainParameters.rpcUrls[0]);
        window["ethereum"].off?.('accountsChanged', this.resetWallet);
        window["ethereum"].off?.('chainChanged', this.resetWallet);
    }

    @action async connect() {
        if (this.connected)
            return true;

        if (!window["ethereum"]) {
            await this.rootStore.uiStore.showModal('metamask');
            return false;
        }
        this.rawProvider = window["ethereum"];
        await this.initProvider();
        await this.loadBalance();
        return true;
    }

    @action async initProvider() {
        await window['ethereum'].enable();
        let chainId = await this.web3.eth.getChainId();
        if (chainId !== CHAIN_ID) {
            try {
                await window["ethereum"].request({ method: 'wallet_addEthereumChain', params: [chainParameters] });
                chainId = await this.web3.eth.getChainId();
            } catch (e) {
                console.log(e);
            }
        }

        window["ethereum"].on?.('accountsChanged', this.resetWallet);
        window["ethereum"].on?.('chainChanged', this.resetWallet);

        if (chainId !== CHAIN_ID) {
            alert(`Please switch to ${TEST_NETWORK ? 'BSC Test' : 'BSC'} network`);
            await this.resetWallet();
            return false;
        }

        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
        runInAction(() => { this.account = accounts[0]; this.connected = true });
    }

    loadBalance = async () => {
        const contract = this.rewardTokenContract;
        const balance = toBNJS(await contract.methods.balanceOf(this.account).call());
        const decimals = toBNJS(10).pow(await contract.methods.decimals().call());
        runInAction(() => this.rtBalance = balance.div(decimals));
    }

    get web3(): Web3 {
        return new Web3(this.rawProvider);
    }

    get nftTokenContract(): NFTTokenContractContext {
        return new this.web3.eth.Contract(NFTTokenABI as any, NFT_TOKEN_CONTRACT) as unknown as NFTTokenContractContext;
    }

    get rewardTokenContract(): RewardTokenContractContext {
        return new this.web3.eth.Contract(RewardTokenABI as any, REWARD_TOKEN_CONTRACT) as unknown as RewardTokenContractContext;
    }
}