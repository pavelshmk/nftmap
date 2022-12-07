import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
import MainPage from "../pages/MainPage";
import PlanetsToolbar from "./PlanetsToolbar";
import Planets from "./Planets";
import PlanetsInfo from "./PlanetsInfo";
import EarthContinents from "./EarthContinents";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore } from "../stores";
import { PlanetsEnum } from "../stores/UIStore";
import { Swipeable } from 'react-swipeable';

interface ISolarSystemProps extends WithTranslation {
}

interface ISolarSystemState {
    searchValue: string;
    priceRange: number[];
}

@observer
class SolarSystemComponent extends React.Component<ISolarSystemProps, ISolarSystemState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;

    state: ISolarSystemState = {
        searchValue: '',
        priceRange: [-Infinity, Infinity],
    }

    render() {
        const { t } = this.props;
        const { activeTabDelayed, activeTabTransitioning, solarSystemStatus, activePlanet, showPlanetContent } = this.uiStore;
        const { searchValue, priceRange } = this.state;

        return (
            <Swipeable
                nodeName='section'
                onSwipedLeft={() => this.uiStore.swipePlanetsMobile(1)}
                onSwipedRight={() => this.uiStore.swipePlanetsMobile(-1)}
                className={classNames('solar-system', solarSystemStatus, { 'active-tab': activeTabDelayed === 'solarSystem' })}
                style={{
                    display: activeTabTransitioning ? 'block' : '',
                }}
            >
                    {this.entityStore.ready ? (
                        <>
                            <MainPage />
                            <PlanetsToolbar onSearch={(searchValue, priceRange) => this.setState({ searchValue, priceRange })} />
                            <Planets />
                            <PlanetsInfo />
                            <EarthContinents filterName={searchValue} priceRange={priceRange} />
                        </>
                    ) : null}
                    <div className={classNames('soon', 'switch-content-visibility', 'desktop-only', { show: activePlanet === PlanetsEnum.earth, 'switch-checked': showPlanetContent === PlanetsEnum.earth })} data-appear-onplanet='earth'>Soon...
                        <div className="bg"/>
                    </div>
            </Swipeable>
        )
    }
}

const SolarSystem = withTranslation()(SolarSystemComponent);
export default SolarSystem;
