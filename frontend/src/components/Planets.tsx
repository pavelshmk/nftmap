import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore } from "../stores";
import { PlanetsEnum } from "../stores/UIStore";
import classNames from "classnames";
import { PLANET_DATA, PLANET_ORDER } from "../utils/const";
import { PlanetInfo } from "../utils/types";
import { PlanetType } from "../utils/graphql";
import { toBNJS } from "../utils/utilities";

interface IPlanetsProps extends WithTranslation {
}

interface IPlanetsState {
}

@observer
class PlanetsComponent extends React.Component<IPlanetsProps, IPlanetsState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;

    state: IPlanetsState = {
    }

    zoomIn = async (name: PlanetsEnum) => {
        this.uiStore.zoomInPlanet(name);
    }

    render() {
        const { t } = this.props;
        const { activePlanet, aboveBreakpoint, zoomOutTransitioningStep, showPlanetContent, mobileVisiblePlanet, solarSystemStatus } = this.uiStore;

        let planetsTransform = '';
        if (zoomOutTransitioningStep) {
            if (!aboveBreakpoint)
                planetsTransform = `translateX(${aboveBreakpoint ? -100 : -50 - mobileVisiblePlanet * 50}vw)`;
        } else {
            if (typeof activePlanet === 'undefined') {
                if (!aboveBreakpoint)
                    planetsTransform = `translateX(${-50 - mobileVisiblePlanet * 50}vw)`;
            } else {
                planetsTransform = `translateX(${aboveBreakpoint ? (activePlanet * -50) : (activePlanet * -100 - 100)}vw)`;
            }
        }

        return (
            <div
                className={classNames('planets-canvas', 'switch-content-visibility', { 'switch-checked': showPlanetContent === PlanetsEnum.earth })}
                style={{
                    transition: zoomOutTransitioningStep ? '.15s ease' : undefined,
                    opacity: zoomOutTransitioningStep ? 0 : undefined,
                }}
            >
                <div
                    className="planets"
                    style={{
                        transform: planetsTransform,
                        transition: zoomOutTransitioningStep === 2 ? '0s ease' : undefined,
                    }}
                >
                    {PLANET_ORDER.map((planet): [PlanetsEnum, PlanetType] => ([planet, this.entityStore.planetsMap[planet]]))
                        .map(([planet, info]) => (
                            <div className={classNames('orbit-line', `${PlanetsEnum[planet]}-orbit`, { 'active-planet-mobile': mobileVisiblePlanet === planet })} key={planet}>
                                <img className="orbit desktop-only" src={require('../static/icons/planets/orbit-line.svg')} />
                                <div className="card-planet mobile-only">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="actual-planet-number">#0{info.number}</div>
                                            <img src={require('../static/icons/cards/line-small.svg')} />
                                            <div className="planet-number">08</div>
                                        </div>
                                        <div className="planet-name">{info.name}</div>
                                    </div>
                                    <div className="btn btn-gray btn-more btn-buy btn-icon" onClick={() => this.zoomIn(planet)}>More information
                                        <button type="button" name="button" className="btn btn-box btn-chevron-right icon"/>
                                    </div>
                                </div>
                                {planet === PlanetsEnum.earth ? (
                                    <div className={classNames('earth-tooltip', 'earth', { active: activePlanet === planet })}>
                                        <div className="planet" onClick={() => this.zoomIn(planet)}>
                                            <div className={`planet-${PlanetsEnum[planet]}-default`}/>
                                            <div className="shadow"/>
                                            <div className="shadow-mobile"/>
                                            <div className={`planet-${PlanetsEnum[planet]}-active`}/>
                                        </div>
                                        <div className="tooltip desktop-only">
                                            <div className="tooltip-row">
                                                <p className="title">{info.name}</p>
                                                <div className="union">
                                                    <p>{toBNJS(info.price).toString()}</p>
                                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                              d="M24 4C7.53 4 4 7.53 4 24C4 40.47 7.53 44 24 44C40.47 44 44 40.47 44 24C44 7.53 40.47 4 24 4ZM16 23.9999L23.5428 12L31.0856 23.9999L23.5428 28.4571L16 23.9999ZM16 26.7427L23.5428 35.9998L31.0856 26.7427L23.5428 31.1998L16 26.7427Z"
                                                              fill="white"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="subtitle">+{toBNJS(info.emission).toString()} NFTm / YEAR</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classNames('planet', PlanetsEnum[planet], { active: activePlanet === planet })} onClick={() => this.zoomIn(planet)}>
                                        <div className={`planet-${PlanetsEnum[planet]}-default`}/>
                                        <div className="shadow"/>
                                        <div className="shadow-mobile"/>
                                        <div className={`planet-${PlanetsEnum[planet]}-active`}/>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        )
    }
}

const Planets = withTranslation()(PlanetsComponent);
export default Planets;
