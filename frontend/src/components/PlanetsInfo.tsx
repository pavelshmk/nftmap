import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore, WalletStore } from "../stores";
import { PlanetsEnum } from "../stores/UIStore";
import Timeout from "await-timeout";
import { PLANET_DATA, PLANET_ORDER } from "../utils/const";
import { ETH_PRICE, PlanetInfo } from "../utils/types";
import { numberWithCommas, toBNJS } from "../utils/utilities";
import { PlanetType } from "../utils/graphql";
import { reaction } from "mobx";
import { Api } from "../utils/api";

interface IPlanetsInfoProps extends WithTranslation {
}

interface IPlanetsInfoState {
    perYear: boolean;
    boughtTransitioning: PlanetsEnum[];
    ownerLoading: boolean;
    owner?: string;
}

@observer
class PlanetsInfoComponent extends React.Component<IPlanetsInfoProps, IPlanetsInfoState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;
    @resolve(WalletStore)
    declare protected readonly walletStore: WalletStore;
    @resolve(Api)
    declare protected readonly api: Api;

    state: IPlanetsInfoState = {
        perYear: true,
        boughtTransitioning: [],
        ownerLoading: false,
    }

    componentDidMount() {
        reaction(() => this.uiStore.activePlanet, this.loadPlanetInfo)
        if (this.uiStore.activePlanet) {
            this.loadPlanetInfo(this.uiStore.activePlanet);
        }
    }

    loadPlanetInfo = async (planet: PlanetsEnum) => {
        this.setState({ ownerLoading: true });
        const tokenId = this.entityStore.planetsMap[planet].tokenId;
        const nft = this.walletStore.nftTokenContract;
        try {
            this.setState({ owner: await nft.methods.ownerOf(tokenId.toString()).call() });
        } catch (e) {
            this.setState({ owner: undefined });
        } finally {
            this.setState({ ownerLoading: false });
        }
    }

    onBuy = async (planet: PlanetsEnum) => {
        if (!await this.walletStore.connect())
            return;

        const args = await this.api.getMintArgs(this.walletStore.account, this.entityStore.planetsMap[planet].tokenId);
        const nft = this.walletStore.nftTokenContract;
        console.log(args.tokenMintArgs);
        // @ts-ignore
        const tx = await nft.methods.mint(...args.tokenMintArgs).send({ from: this.walletStore.account, value: args.tokenMintArgs[1] as string });
        await this.loadPlanetInfo(planet);
        await this.entityStore.loadEntities();


        /*this.setState({ bought: [...this.state.bought, planet], boughtTransitioning: [...this.state.boughtTransitioning, planet] });
        await Timeout.set(400);
        this.setState({ boughtTransitioning: this.state.boughtTransitioning.filter(p => p !== planet) });*/
    }

    render() {
        const { t } = this.props;
        const { perYear, boughtTransitioning, ownerLoading, owner } = this.state;
        const { activePlanet } = this.uiStore;

        return (
            <div className="planets-info">
                {PLANET_ORDER.filter(planet => planet !== PlanetsEnum.earth)
                    .map((planet): [PlanetsEnum, PlanetType] => ([planet, this.entityStore.planetsMap[planet]]))
                    .map(([planet, info]) => (
                        <div
                            key={planet}
                            style={{ animation: boughtTransitioning.includes(planet) && 'sold .4s ease-out' }}
                            className={classNames('planet-info', { show: activePlanet === planet, sold: owner })}
                        >
                            <div className="body">
                                <div className="left-content">
                                    <div className="params params-2 animate-2 desktop-only">
                                        <div className="params-label">Name</div>
                                        <div className="params-value">{info.name}</div>
                                    </div>
                                    <div className="wrapper animate-1 mobile-only">
                                        <div className="details-icon">
                                            <div className="btn btn-box btn-etherium"/>
                                            <div className="eth-value">
                                                <strong>{info.price}</strong>
                                                <div>BNB</div>
                                            </div>
                                        </div>
                                        <div className="details-values">
                                            <div className="usd-value">~{toBNJS(info.price).times(ETH_PRICE).toFixed(2)} USD</div>
                                        </div>
                                    </div>
                                    <div className="params params-2 animate-2">
                                        <div className="params-label">Type</div>
                                        <div className="params-value">Planet</div>
                                    </div>
                                    <div className="params full-width animate-3">
                                        <div className="params-row">
                                            <div className="params-col">
                                                <div className="params-label">tokens <span id="textMercury">{perYear ? 'per year' : 'per day'}</span>
                                                </div>
                                                <div className="params-value params-value-green">+{numberWithCommas(toBNJS(info.emission).div(perYear ? 1 : 365).integerValue().toString())} NFTm</div>
                                            </div>
                                            <div className="params-col desktop-only">
                                                <div className="custom-switch">
                                                    <input type="checkbox" name="custom-switch"
                                                           checked={!perYear} onChange={() => this.setState({ perYear: !perYear })} />
                                                        <div className="active-switch"/>
                                                        <div className="switch-content">
                                                            <p className="left-content">Per Year</p>
                                                            <p className="right-content">Per day</p>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="params params-2 animate-4">
                                        <div className="params-label">Distance from the sun</div>
                                        <div className="params-value">{numberWithCommas(toBNJS(info.sunDistance).div('1e6').toString())} million km</div>
                                    </div>
                                    <div className="params params-2 animate-5 desktop-only">
                                        <div className="params-label">Weight</div>
                                        <div className="params-value">{numberWithCommas(toBNJS(info.weight).div('1e21').toString())}×10<sup>21</sup> kg</div>
                                    </div>
                                </div>
                                <div className="right-content"/>
                            </div>
                            {!ownerLoading && (
                                <>
                                    <div className="details details-buy desktop-only">
                                        <div className="wrapper animate-6">
                                            <div className="details-icon">
                                                <div className="btn btn-box btn-etherium"/>
                                            </div>
                                            <div className="details-values">
                                                <strong>{toBNJS(info.price).toString()} BNB</strong>
                                                <div>~{toBNJS(info.price).times(ETH_PRICE).toFixed(2)} USD</div>
                                            </div>
                                        </div>
                                        <div className="details-arrow">
                                            <img className="animate-7" src={require('../static/icons/cards/line-long.svg')} alt="" />
                                        </div>
                                        <div className="details-btn animate-8 desktop-only">
                                            <button type="button" name="button" data-buy="#mercuryInfo"
                                                    className="btn btn-green-2 btn-rectangle btn-buy" onClick={() => this.onBuy(planet)}>Buy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="details details-more">
                                        <div className="details-icon animate-6">
                                            <div className="btn btn-box btn-user"/>
                                        </div>
                                        <div className="details-values animate-7">
                                            <strong>{owner}</strong>
                                            <div>Owner Address</div>
                                        </div>
                                        <div className="details-arrow animate-7 desktop-only">
                                            <img src={require('../static/icons/cards/line-long.svg')} alt="" />
                                        </div>
                                        <div className="details-btn animate-8 desktop-only">
                                            <button type="button" name="button" onClick={() => this.uiStore.showProfile(owner)}
                                                    className="btn btn-gray btn-rectangle btn-buy">More
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
            </div>
        )
    }
}

const PlanetsInfo = withTranslation()(PlanetsInfoComponent);
export default PlanetsInfo;