import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore } from "../stores";
import { PlanetsEnum } from "../stores/UIStore";

interface IMainPageProps extends WithTranslation {
}

interface IMainPageState {
}

@observer
class MainPageComponent extends React.Component<IMainPageProps, IMainPageState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;

    render() {
        const { t } = this.props;

        const planetsLeft = this.entityStore.planets.length - 1 - this.entityStore.mintedPlanets.length;
        const countriesLeft = this.entityStore.countries.length - this.entityStore.mintedCountries.length;

        return (
            <>
                <div className="main-page-title">
                    <h1>Buy yourself a Planet <br className="mobile-only" /> or a Country</h1>
                    <p>With NFT you Literally can do it!</p>
                </div>
                <div className="main-page-cards desktop-only">
                    <div className="card card-blue card-purchased-item disabled">
                        <div className="top-content">
                            <p className="main-number">{planetsLeft}</p>
                            <img src={require('../static/icons/cards/line.svg')} className="arrow" />
                            <p className="number">{this.entityStore.planets.length - 1}</p>
                        </div>
                        <div className="bottom-content">
                            <p className="text">Planets left</p>
                            <button type="button" name="button" className="btn btn-box btn-chevron-right disabled"/>
                        </div>
                    </div>
                    <div data-open-countries-list className="card card-blue card-purchased-item hover" onClick={() => this.uiStore.zoomInPlanet(PlanetsEnum.earth)}>
                        <div className="top-content">
                            <p className="main-number">{countriesLeft}</p>
                            <img src={require('../static/icons/cards/line.svg')} className="arrow" />
                            <p className="number">{this.entityStore.countries.length}</p>
                        </div>
                        <div className="bottom-content">
                            <p className="text">Countries left</p>
                            <button type="button" name="button" className="btn btn-box btn-chevron-right"/>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

const MainPage = withTranslation()(MainPageComponent);
export default MainPage;