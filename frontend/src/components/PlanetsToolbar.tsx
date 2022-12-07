import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore } from "../stores";
import { PLANET_DATA } from "../utils/const";
import classNames from "classnames";
import { PlanetsEnum } from "../stores/UIStore";
import ReactBootstrapSlider from 'react-bootstrap-slider';

interface IPlanetsToolbarProps extends WithTranslation {
    onSearch: (name: string, priceRange: number[]) => any;
}

interface IPlanetsToolbarState {
    searchValue: string,
    sliderValue: number[];
}

@observer
class PlanetsToolbarComponent extends React.Component<IPlanetsToolbarProps, IPlanetsToolbarState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;
    @resolve(EntityStore)
    declare protected readonly entityStore: EntityStore;

    state: IPlanetsToolbarState = {
        searchValue: '',
        sliderValue: [60, 410],
    }

    componentDidMount() {
        this.setState({ sliderValue: [0, this.entityStore.maxCountryPrice] });
        this.props.onSearch('', [0, this.entityStore.maxCountryPrice]);
    }

    onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.onSearch(this.state.searchValue, this.state.sliderValue);
    }

    render() {
        const { t } = this.props;
        const { activePlanet, activePlanetDelayed, showPlanetContent } = this.uiStore;
        const { sliderValue, searchValue } = this.state;

        const planetData = this.entityStore.planetsMap[activePlanetDelayed];

        return (
            <div className={classNames('planets-toolbar', 'switch-content-visibility', { 'switch-checked': showPlanetContent === PlanetsEnum.earth })}>
                <div className="name">
                    <button type="button" name="button" className="btn btn-box btn-chevron-left desktop-only"
                            title="Back to solar system." data-zoom-out onClick={() => this.uiStore.zoomOutPlanets()} />
                    <div className="planet-number-block mobile-only">
                        <div className="row">
                            <div id="planetNumber" className="actual-planet-number">#0{planetData?.number}</div>
                            <img src={require('../static/icons/cards/line-small.svg')} />
                            <div className="planet-number">08</div>
                        </div>
                    </div>
                    <div className="value-wrapper">
                        <p id="oldValue">{planetData?.name}</p>
                        <p id="newValue"/>
                    </div>
                </div>
                <div className="form-elements desktop-only">
                    <form onSubmit={this.onSearchSubmit}>
                        <div className="custom-input">
                            <div className="custom-search">
                                <input type="text" name="search" placeholder="Search by name" value={searchValue} onChange={e => this.setState({ searchValue: e.target.value })} />
                                <button type="submit" name="button" className={classNames('btn btn-box btn-chevron-right', { disabled: !searchValue.length })}/>
                            </div>
                        </div>
                        {/*<div className="slider-wrapper">
                            <p className="title">Price</p>
                            <div className="slider-content">
                                <div className="slider-header">
                                    <p id="minRangeValue">{sliderValue[0]}</p>
                                    <p id="maxRangeValue">{sliderValue[1]}</p>
                                </div>
                                <ReactBootstrapSlider
                                    className="range-slider"
                                    min={0}
                                    max={this.entityStore.maxCountryPrice}
                                    step={1}
                                    tooltip='hide'
                                    value={sliderValue}
                                    change={e => this.setState({ sliderValue: e.target.value })}
                                    triggerSlideEvent
                                />
                            </div>
                        </div>*/}
                    </form>
                </div>
                <div className={classNames('custom-switch', 'switch-icons', { show: activePlanet === PlanetsEnum.earth })} data-appear-onplanet='earth'>
                    <input type="checkbox" data-switch-content=".switch-content-visibility" name="custom-switch" checked={!!showPlanetContent} onChange={() => this.uiStore.togglePlanetContent(activePlanet)} />
                    <div className="active-switch"/>
                    <div className="switch-content">
                        <p className="left-content">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M43.9885 23.3517C44.0091 23.1828 44.0003 23.0126 43.9662 22.8472C43.6891 17.9385 41.6466 13.3623 38.1422 9.85781C34.3646 6.08039 29.3422 4 24 4C18.6578 4 13.6354 6.08039 9.85781 9.85781C6.08039 13.6354 4 18.6578 4 24C4 26.9105 4.61883 29.7255 5.79188 32.2966C5.80938 32.3398 5.82875 32.3818 5.84969 32.4228C6.82547 34.5222 8.17211 36.4564 9.85781 38.1422C13.6354 41.9196 18.6578 44 24 44C27.6573 44 31.2358 43.0033 34.3486 41.1177C35.0867 40.6705 35.3226 39.7098 34.8755 38.9716C34.4284 38.2335 33.4675 37.9977 32.7295 38.4448C30.105 40.0347 27.0864 40.875 24 40.875C17.2551 40.875 11.4227 36.8966 8.72344 31.1638C8.52156 30.0144 8.73242 28.928 9.30219 28.2252C9.72594 27.7024 10.2974 27.4375 11.0011 27.4375C11.0075 27.4375 11.0141 27.4375 11.0205 27.4376C12.7246 27.4492 14.8638 28.9847 16.8912 31.6522C19.2389 34.7304 21.8819 36.97 24.7466 38.3088C24.9605 38.4088 25.1855 38.4562 25.4071 38.4562C25.9951 38.4562 26.5583 38.1227 26.8237 37.5548C27.189 36.773 26.8514 35.8431 26.0697 35.4777C23.6667 34.3548 21.4147 32.43 19.3776 29.7592C15.9745 25.2814 12.9663 24.3258 11.042 24.3125C9.56164 24.3023 8.2275 24.8503 7.22844 25.8637C7.16281 25.2691 7.12758 24.6653 7.1257 24.0538C7.38187 20.4259 9.7793 17.7776 12.8422 17.7499C12.8585 17.7498 12.8748 17.7497 12.8911 17.7497C14.2916 17.7497 15.8302 18.2895 17.3444 19.3127C19.2232 20.5823 21.0496 22.5534 22.773 25.1716C23.0732 25.6277 23.5715 25.8752 24.0795 25.8752C24.3744 25.8752 24.6725 25.7919 24.9372 25.6177C25.658 25.1432 25.8577 24.1742 25.3832 23.4534C20.2924 15.7194 15.3244 14.6023 12.814 14.6251C11.9338 14.633 11.0764 14.778 10.2627 15.05C11.8165 12.9727 14.7135 11.7344 16.6562 11.7344C19.1949 11.7344 23.4043 14.1415 27.0857 19.5191C30.6403 24.7113 33.5865 26.7344 37.5938 26.7344C38.3162 26.7344 39.5407 26.5258 40.745 26.0768C40.7359 26.1496 40.7262 26.2223 40.7161 26.2949C40.1235 28.7866 37.8865 30.5357 35.2341 30.5626C33.5433 30.5793 31.7366 29.871 29.8635 28.4563C29.1749 27.9361 28.1951 28.0728 27.675 28.7614C27.1549 29.45 27.2915 30.4298 27.9802 30.9499C30.386 32.7671 32.8056 33.6879 35.1735 33.6879C35.2043 33.6879 35.2351 33.6877 35.2658 33.6874C36.2656 33.6773 37.227 33.5056 38.1238 33.1977C38.0872 33.2538 38.0509 33.3101 38.0135 33.3659C37.5339 34.0834 37.7266 35.0538 38.4441 35.5333C39.1616 36.0129 40.1318 35.8202 40.6114 35.1028C42.2866 32.5971 43.3645 29.7923 43.7915 26.8678C43.7932 26.8599 43.7954 26.8523 43.7971 26.8444C43.8142 26.7655 43.823 26.6869 43.8278 26.6087C43.942 25.7475 44 24.8765 44 24C44 23.7833 43.9953 23.5673 43.9885 23.3517ZM39.3404 16.9727C37.6548 17.3249 36.3075 15.8488 33.822 12.6052C32.7405 11.1939 31.5561 9.64828 30.1536 8.2868C34.2212 9.88531 37.5224 13.0201 39.3404 16.9727ZM37.5938 23.6094C35.6099 23.6094 33.3635 23.1573 29.6643 17.7537C27.802 15.0334 25.6145 12.7423 23.3384 11.1281C21.1648 9.5868 19.0028 8.72531 17.0566 8.62039C17.1899 8.56 17.3242 8.50141 17.4594 8.44438C17.5601 8.43367 17.6612 8.41336 17.7616 8.38195C19.0909 7.96656 20.377 7.59375 21.5 7.59375C26.0449 7.59375 28.7376 11.1077 31.3415 14.5059C32.6805 16.2534 33.9453 17.9039 35.4223 18.968C36.5268 19.7638 37.6699 20.162 38.8412 20.162C39.3489 20.162 39.862 20.0866 40.3793 19.9368C40.5917 20.7927 40.7386 21.6741 40.8143 22.5755C40.0187 23.128 38.3751 23.6094 37.5938 23.6094Z"
                                    fill="white"/>
                            </svg>
                        </p>
                        <p className="right-content">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M10 16C10 14.8954 10.8954 14 12 14H32C33.1046 14 34 14.8954 34 16C34 17.1046 33.1046 18 32 18H12C10.8954 18 10 17.1046 10 16ZM14 24C14 22.8954 14.8954 22 16 22H36C37.1046 22 38 22.8954 38 24C38 25.1046 37.1046 26 36 26H16C14.8954 26 14 25.1046 14 24ZM12 30C10.8954 30 10 30.8954 10 32C10 33.1046 10.8954 34 12 34H32C33.1046 34 34 33.1046 34 32C34 30.8954 33.1046 30 32 30H12Z"
                                      fill="white"/>
                            </svg>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

const PlanetsToolbar = withTranslation()(PlanetsToolbarComponent);
export default PlanetsToolbar;