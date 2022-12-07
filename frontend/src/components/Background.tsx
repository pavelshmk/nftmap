import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import { ADAPTIVE_BREAKPOINT } from "../utils/const";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { UIStore } from "../stores";
import classNames from "classnames";
import { PlanetsEnum } from "../stores/UIStore";
import _ from "lodash";

interface IBackgroundProps extends WithTranslation {
}

interface IBackgroundState {
}

@observer
class BackgroundComponent extends React.Component<IBackgroundProps, IBackgroundState> {
    private stars: HTMLDivElement;

    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    state: IBackgroundState = {
    }

    componentDidMount() {
        // @ts-ignore
        document.body.addEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove =  _.throttle((e: React.MouseEvent) => {
       if (window.outerWidth > ADAPTIVE_BREAKPOINT) {
           const { clientX, clientY } = e;
           const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
           if (this.stars) {
               this.stars.style.left = `${(windowWidth / 2 - clientX) / 50}px`;
               this.stars.style.top = `${(windowHeight / 2 - clientY) / 50}px`;
           }
       }
    }, 1000 / 60);

    render() {
        const { t } = this.props;
        const { spaceSwitching, showPlanetContent, mobileMenuVisible } = this.uiStore;

        return (
            <div className="space-background">
                <div className="background-color"/>
                <div
                    className={classNames('background-stars', 'switch-content-visibility', { 'switch-checked': showPlanetContent === PlanetsEnum.earth })}
                    ref={ref => this.stars = ref}
                    style={{ backgroundSize: spaceSwitching ? 'calc(100% * 1.5)' : undefined }}
                />
                <div className="background-blend"/>
                <div className='background-sun'>
                    <video className={classNames({ active: mobileMenuVisible })} width="100vh" height="auto" preload="auto" autoPlay loop poster="" muted>
                        <source src={require('../static/videos/sun.mp4')} type="video/mp4"/>
                        <source src={require('../static/videos/sun.webm')} type="video/webm"/>
                    </video>
                </div>
                <div className="background-dodge">
                    <div className="blend-red desktop-only"/>
                    <div className="blend-red-2 mobile-only"/>
                    <div className="blend-purple"/>
                    <div className="blend-purple-2"/>
                </div>
            </div>
        )
    }
}

const Background = withTranslation()(BackgroundComponent);
export default Background;