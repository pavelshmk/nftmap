import React from 'react';
import classNames from "classnames";
import { resolve } from "inversify-react";
import { UIStore, WalletStore } from "../stores";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import BN from "bignumber.js";
import { toBNJS } from "../utils/utilities";
import _ from "lodash";
import { Api } from "../utils/api";
import { EntityType } from "../utils/graphql";
import { Link } from 'react-router-dom';
import { ObservableHistory } from "mobx-observable-history";

interface IWalletInfoModalProps {
}

interface IWalletInfoModalState {
    balance: BN;
    accumulated: BN;
    ownedCount: number;
    owned: EntityType[];
}

const initialState = {
    balance: toBNJS(0),
    accumulated: toBNJS(0),
    ownedCount: 0,
    owned: [],
};

@observer
class WalletInfoModal extends React.Component<IWalletInfoModalProps, IWalletInfoModalState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(WalletStore)
    declare protected readonly walletStore: WalletStore;
    @resolve(Api)
    declare protected readonly api: Api;
    @resolve(ObservableHistory)
    declare protected readonly navigation: ObservableHistory;

    state: IWalletInfoModalState = initialState;

    componentDidMount() {
        reaction(() => this.uiStore.activeAccount, this.loadAccountInfo)
        if (this.uiStore.activeAccount) {
            this.setState({
                balance: toBNJS(0),
                accumulated: toBNJS(0),
                owned: [],
            });
            this.loadAccountInfo(this.uiStore.activeAccount);
        }
    }

    loadAccountInfo = async (address: string) => {
        this.setState(initialState)
        const rt = this.walletStore.rewardTokenContract;
        const nft = this.walletStore.nftTokenContract;
        const ownedCount = parseInt(await nft.methods.balanceOf(address).call());
        this.setState({
            balance: toBNJS(await rt.methods.balanceOf(address).call()).div('1e18'),
            accumulated: toBNJS(await nft.methods.rewardBalance(address).call()).div('1e18'),
            ownedCount
        });
        const promises = _.range(ownedCount).map(i => nft.methods.tokenOfOwnerByIndex(address, i.toString()).call());
        const tokenIds = await Promise.all(promises);
        const owned = await this.api.getEntitiesInfo(tokenIds);
        this.setState({ owned: owned.entitiesInfo });
    }

    onClaim = async () => {
        const nft = this.walletStore.nftTokenContract;
        await nft.methods.claimReward().send({ from: this.walletStore.account });
        await this.loadAccountInfo(this.walletStore.account);
    }

    render() {
        const { openModalDelayed, openModal, activeAccount } = this.uiStore;
        const { balance, accumulated, ownedCount, owned } = this.state;

        const currentUser = activeAccount === this.walletStore.account;

        return (
            <div id="moreInfoPopup" className={classNames('popup', { show: openModalDelayed === 'moreInfo' })} style={{ display: openModal === 'moreInfo' && 'block' }}>
                <div className="popup-container">
                    <button className="popup-close btn btn-box btn-close" data-close-popup="moreInfoPopup" onClick={() => this.uiStore.hideModals()} />
                    <div className="wallet">
                        <div className="wallet-header">
                            <div className="wallet-avatar">
                                <img src={require('../static/images/avatars/wallet.png')} alt="" />
                            </div>
                            <div className="wallet-creds">
                                <div className="wallet-address">{activeAccount}</div>
                                {currentUser && <div className="wallet-label">Your Wallet</div>}
                            </div>
                        </div>
                        <div className="wallet-data">
                            <div className="wallet-data-item">
                                <div className="wallet-data-wrap">
                                    <div className="wallet-data-icon btn btn-box btn-creditcard"/>
                                    <div className="wallet-data-info">
                                        <div className="wallet-data-label">Wallet NFTm</div>
                                        <div className="wallet-data-value">{balance.toFixed(2)} NFTm</div>
                                    </div>
                                </div>
                            </div>
                            <div className="wallet-data-item">
                                <div className="wallet-data-wrap">
                                    <div className="wallet-data-icon btn btn-box btn-shield"/>
                                    <div className="wallet-data-info">
                                        <div className="wallet-data-label">Accumulated NFTm</div>
                                        <div className="wallet-data-value">{accumulated.toFixed(2)} NFTm</div>
                                    </div>
                                </div>
                                {currentUser && <button className="btn btn-gray btn-more" onClick={this.onClaim}>Claim All</button>}
                            </div>
                        </div>
                        <div className="wallet-owned">
                            <div className="wallet-owned-header">
                                <div className="wallet-owned-title">Owned NTFmap</div>
                                <div className="wallet-owned-arrow">
                                    <img src={require('../static/icons/cards/line-long.svg')} alt="" />
                                </div>
                                <div className="wallet-owned-number">{ownedCount}</div>
                            </div>
                            <div className="wallet-owned-list">
                                {owned.length > 0 ? (
                                    owned.map(entity => (
                                        <div className="wallet-owned-item" key={entity.tokenId}>
                                            <div className="wallet-owned-image">
                                                <img src={require('../static/images/continents/token-usa-middle.png')} alt="" />
                                            </div>
                                            <div className="wallet-owned-name">{entity.name}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="wallet-owned-empty">
                                        <div className="wallet-owned-text">
                                            {/*<img src={require('../static/icons/logos/icon-logo.svg')} alt="" />*/}
                                            <div>{currentUser ? 'You don\'t' : 'This wallet doesn\'t'} own any NFTmaps. {currentUser && 'Go get one!'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WalletInfoModal;
