import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore } from "../stores";
import { PlanetsEnum } from "../stores/UIStore";
import { COUNTRY_DATA, COUNTRY_EMISSION } from "../utils/const";
import { numberWithCommas, toBNJS } from "../utils/utilities";
import { ETH_PRICE } from "../utils/types";

interface IEarthContinentsProps extends WithTranslation {
    filterName: string;
    priceRange: number[];
}

interface IEarthContinentsState {
}

@observer
class EarthContinentsComponent extends React.Component<IEarthContinentsProps, IEarthContinentsState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;

    render() {
        const { t, filterName, priceRange } = this.props;
        const { showPlanetContent } = this.uiStore;

        const countries = this.entityStore.countries.filter(c => RegExp(filterName, 'i').test(c.name) && c.price >= priceRange[0] && c.price <= priceRange[1]);

        return (
            <div className={classNames('earth-continents', 'switch-content-visibility', { 'switch-checked': showPlanetContent === PlanetsEnum.earth })}>
                {countries.map(c => (
                    <div className={`card card-blue card-token-item animate-${c.number}`} key={c.number}>
                        <div className="token-image">
                            <img src={require('../static/images/continents/token-usa-small.png')/*c.image*/} alt={c.code} />
                        </div>
                        <div className="token-number">#{c.number}</div>
                        <div className="token-name">{c.name}</div>
                        <div className="token-emission">+{numberWithCommas(toBNJS(c.emission).toFixed(0))} NFTm / YEAR</div>
                        <div className="token-price">
                            <div className="btn btn-box btn-etherium"/>
                            <div className="token-price-eth">
                                <b>{toBNJS(c.price).toString()}</b>
                                <span>bnb</span>
                            </div>
                            <div className="token-price-usd">~{numberWithCommas(toBNJS(c.price).times(ETH_PRICE).integerValue().toString())} USD</div>
                        </div>
                        <button
                            onClick={() => this.uiStore.showCountry(c)}
                            className="btn btn-gray btn-more desktop-only"
                        >
                            More
                        </button>
                    </div>
                ))}
                <div className="card plug"/>
            </div>
        )
    }
}

const EarthContinents = withTranslation()(EarthContinentsComponent);
export default EarthContinents;