import React from 'react';
import classNames from "classnames";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { UIStore } from "../stores";

interface INavModalProps {
}

interface INavModalState {
}

@observer
class NavModal extends React.Component<INavModalProps, INavModalState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    render() {
        const { mobileMenuVisible, mobileMenuTransitioning, activeTab } = this.uiStore;

        return (
            <div id="navBlock" className={classNames('nav-block', 'mobile-only', { active: mobileMenuVisible })} style={{ display: mobileMenuTransitioning ? 'flex' : undefined }}>
                <nav>
                    <p
                        className={classNames({ active: activeTab === 'solarSystem', show: mobileMenuVisible })}
                        onClick={() => this.uiStore.toggleTab('solarSystem')}
                    >
                        Solar System
                    </p>
                    <p
                        className={classNames({ active: activeTab === 'aboutUs', show: mobileMenuVisible })}
                        onClick={() => this.uiStore.toggleTab('aboutUs')}
                    >
                        About
                    </p>
                </nav>
                <div className="social">
                    <p className="text">Share with your Friends</p>
                    <a href="#" className="btn btn-box btn-twitter"/>
                    <a href="#" className="btn btn-box btn-telegram"/>
                </div>
            </div>
        )
    }
}

export default NavModal;
