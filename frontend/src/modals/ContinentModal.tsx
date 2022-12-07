import React from 'react';
import classNames from "classnames";
import { numberWithCommas, toBNJS } from "../utils/utilities";
import { ETH_PRICE } from "../utils/types";
import { resolve } from "inversify-react";
import { EntityStore, UIStore, WalletStore } from "../stores";
import { observer } from "mobx-react";
import Timeout from "await-timeout";
import { reaction } from "mobx";
import { PlanetsEnum } from "../stores/UIStore";
import { CountryType } from "../utils/graphql";
import { Api } from "../utils/api";

interface IContinentModalProps {
}

interface IContinentModalState {
    perYear: boolean;
    sold: boolean;
    soldAnimating: boolean;
    ownerLoading: boolean;
    owner?: string;
}

const alertStatuses = [
    null,
    { title: 'No data', cls: 'alert-no-data' },
    { title: 'Hostile', cls: 'alert-hostile' },
    { title: 'Contentious', cls: 'alert-contentious' },
    { title: 'Contentious', cls: 'alert-contentious-2' },
    { title: 'Permissive', cls: 'alert-permissive' },
]

@observer
class ContinentModal extends React.Component<IContinentModalProps, IContinentModalState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;
    @resolve(WalletStore)
    declare protected readonly walletStore: WalletStore;
    @resolve(Api)
    declare protected readonly api: Api;

    state: IContinentModalState = {
        perYear: true,
        sold: false,
        soldAnimating: false,
        ownerLoading: false,
    }

    componentDidMount() {
        reaction(() => this.uiStore.activeCountry, this.loadCountryInfo)
        if (this.uiStore.activeCountry) {
            this.loadCountryInfo(this.uiStore.activeCountry);
        }
    }

    loadCountryInfo = async (country: CountryType) => {
        if (!country)
            return;
        this.setState({ ownerLoading: true });
        const tokenId = country.tokenId;
        const nft = this.walletStore.nftTokenContract;
        try {
            this.setState({ owner: await nft.methods.ownerOf(tokenId.toString()).call() });
        } catch (e) {
            this.setState({ owner: undefined });
        } finally {
            this.setState({ ownerLoading: false });
        }
    }

    onBuy = async () => {
        if (!await this.walletStore.connect())
            return;

        const args = await this.api.getMintArgs(this.walletStore.account, this.uiStore.activeCountry.tokenId);
        const nft = this.walletStore.nftTokenContract;
        console.log(args.tokenMintArgs);
        // @ts-ignore
        const tx = await nft.methods.mint(...args.tokenMintArgs).send({ from: this.walletStore.account, value: args.tokenMintArgs[1] as string });
        await this.loadCountryInfo(this.uiStore.activeCountry);
        await this.entityStore.loadEntities();

        /*this.setState({ sold: true, soldAnimating: true });
        await Timeout.set(400);
        this.setState({ soldAnimating: false });*/
    }

    render() {
        const { openModalDelayed, openModal, activeCountry } = this.uiStore;
        const { perYear, sold, soldAnimating, ownerLoading, owner } = this.state;

        return (
            <div id="continentPopup" className={classNames('popup', 'popup-token', { show: openModalDelayed === 'continent', sold: !ownerLoading && owner })} style={{ display: openModal === 'continent' && 'block', animation: soldAnimating && 'sold .4s ease-out' }}>
                <div className="popup-container">
                    <button data-close-popup="continentPopup" className="popup-close btn btn-box btn-close desktop-only" onClick={() => this.uiStore.hideModals()} />
                    <div className="token-number animate-mobile-2">
                        <div className="token-number-value">#{activeCountry?.number}</div>
                        <div className="token-number-arrow"><img src={require('../static/icons/cards/line.svg')} alt="" /></div>
                        <div className="token-number-total">{this.entityStore.countries?.length}</div>
                    </div>
                    <div className="token-name animate-mobile-3">
                        <i>{activeCountry?.name}</i>
                        <span className="desktop-only">NFT</span>
                    </div>
                    <div className="token-image animate-mobile-4">
                        <img src={/*activeCountry?.image*/require('../static/images/continents/token-usa-big.png')} alt={activeCountry?.code} />
                    </div>
                    <div className={classNames('alert', alertStatuses[activeCountry?.cryptoIndex]?.cls, 'desktop-only', 'animate-mobile-5')}>
                        <p className="alert-subtext">Legal Status</p>
                        <p className="alert-status">{alertStatuses[activeCountry?.cryptoIndex]?.title}</p>
                    </div>
                    <div className="wrapper mobile-only animate-mobile-6">
                        <div className="details-icon">
                            <div className="btn btn-box btn-etherium"/>
                            <div className="eth-value">
                                <strong>{toBNJS(activeCountry?.price || 0).toString()}</strong>
                                <div>BNB</div>
                            </div>
                        </div>
                        <div className="details-values">
                            <div className="usd-value">~107 735.50 USD</div>
                        </div>
                    </div>
                    <div className="row-4 animate-mobile-7">
                        <div className="params desktop-only">
                            <div className="params-label">Name</div>
                            <div className="params-value">{activeCountry?.name}</div>
                        </div>
                        <div className="params animate-mobile-8">
                            <div className="params-label">Type</div>
                            <div className="params-value">Country</div>
                        </div>
                        <div className="params desktop-only animate-mobile-9">
                            <div className="params-label">Surface Area</div>
                            <div className="params-value">{numberWithCommas(activeCountry?.area || '')} km²</div>
                        </div>
                        <div className="params mobile-only animate-mobile-10">
                            <div className="params-label">Population</div>
                            <div className="params-value">{numberWithCommas(activeCountry?.population || '')}</div>
                        </div>
                    </div>
                    <div className="row-2">
                        <div className="params animate-mobile-11">
                            <div className="params-row">
                                <div className="params-col">
                                    <div className="params-label">tokens <span id="textPopup">{perYear ? 'per year' : 'per day'}</span></div>
                                    <div className="params-value params-value-green">+{numberWithCommas(toBNJS(activeCountry?.emission || 0).div(perYear ? 1 : 365).integerValue().toString())} NFTm</div>
                                </div>
                                <div className="params-col desktop-only">
                                    <div className="custom-switch">
                                        <input type="checkbox" name="custom-switch" checked={!perYear} onChange={() => this.setState({ perYear: !perYear })} />
                                        <div className="active-switch"/>
                                        <div className="switch-content">
                                            <p className="left-content">Per year</p>
                                            <p className="right-content">Per day</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="params animate-mobile-12">
                            <div className="params-label">GDP</div>
                            <div className="params-value">{numberWithCommas(activeCountry?.gdp || '')} USD</div>
                        </div>
                    </div>
                    {!ownerLoading && (
                        <>
                            <div className="details details-buy animate-mobile-13 desktop-only">
                                <div className="details-icon">
                                    <div className="btn btn-box btn-etherium"/>
                                </div>
                                <div className="details-values">
                                    <strong>{toBNJS(activeCountry?.price || 0).toString()} BNB</strong>
                                    <div>~{toBNJS(activeCountry?.price || '').times(ETH_PRICE).integerValue().toString()} USD</div>
                                </div>
                                <div className="details-arrow">
                                    <img src={require('../static/icons/cards/line-long.svg')} alt="" />
                                </div>
                                <div className="details-btn">
                                    <button type="button" name="button" data-buy="#continentPopup"
                                            className="btn btn-green-2 btn-rectangle btn-buy" onClick={() => this.onBuy()}>Buy
                                    </button>
                                </div>
                            </div>
                            <div className="details animate-mobile-13 details-more">
                                <div className="details-icon">
                                    <div className="btn btn-box btn-user"/>
                                </div>
                                <div className="details-values">
                                    <strong>{owner}</strong>
                                    <div>Owner Address</div>
                                </div>
                                <div className="details-arrow">
                                    <img src={require('../static/icons/cards/line-long.svg')} alt="" />
                                </div>
                                <div className="details-btn">
                                    <button type="button" name="button" onClick={() => this.uiStore.showProfile(owner)}
                                            className="btn btn-gray btn-rectangle btn-buy">More
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default ContinentModal;
