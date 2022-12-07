import React from 'react';
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { UIStore, WalletStore } from "../stores";
import { WithTranslation, withTranslation } from "react-i18next";
import classNames from "classnames";
import { ActiveTab } from "../stores/UIStore";
import Timeout from "await-timeout";
import { reaction } from "mobx";

interface IHeaderProps extends WithTranslation {
}

interface IHeaderState {
}

@observer
class HeaderComponent extends React.Component<IHeaderProps, IHeaderState> {
    private tabLine: HTMLDivElement;

    @resolve(WalletStore)
    declare protected readonly walletStore: WalletStore;
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    state: IHeaderState = {
    }

    componentDidMount() {
        switch (this.uiStore.activeTab) {
            case 'solarSystem':
                this.tabLine.style.left = '0';
                break;
            case 'aboutUs':
                this.tabLine.style.left = '50%';
                break;
        }
        reaction(() => this.uiStore.activeTab, async (newVal, prevVal) => {
            if (newVal === prevVal) return;
            switch (newVal) {
                case "solarSystem":
                    this.tabLine.style.left = '0';
                    this.tabLine.style.width = '100%';
                    await Timeout.set(250);
                    this.tabLine.style.width = '';
                    break;
                case 'aboutUs':
                    this.tabLine.style.width = '100%';
                    await Timeout.set(250);
                    this.tabLine.style.left = '50%';
                    this.tabLine.style.width = '';
                    break;
            }
        })
    }

    onSwitchTab = async (tab: ActiveTab) => {
        this.uiStore.toggleTab(tab);
    }

    onSignIn = () => {
        if (this.walletStore.metamaskFound) {
            this.walletStore.connect();
        } else {
            this.uiStore.showModal('metamask');
        }
    }

    render() {
        const { t } = this.props;
        const { activeTab, solarSystemStatus, mobileMenuVisible, openModalDelayed } = this.uiStore;

        return (
            <header className={classNames({ 'background-blur': activeTab === 'aboutUs' })}>
                <button
                    type="button"
                    name="button"
                    data-active={(solarSystemStatus === 'zoom-in').toString()}
                    className={classNames('btn', 'btn-box', 'btn-chevron-left', 'mobile-only', { show: solarSystemStatus === 'zoom-in' && !openModalDelayed })}
                    title="Back to solar system."
                    data-zoom-in-show
                    data-zoom-out
                    onClick={() => this.uiStore.zoomOutPlanets()}
                />
                <button data-active="false" data-close-popup
                        className={classNames('popup-close', 'btn', 'btn-box', 'btn-close', 'mobile-only', { show: openModalDelayed === 'continent' })} onClick={() => this.uiStore.hideModals()} />

                <img src={require('../static/icons/logos/full-nftmap-logo.svg')} alt="logo" className="logo desktop-only" />
                <img src={require('../static/icons/logos/nftmap-logo.svg')} alt="logo" className="logo-mobile mobile-only" />
                <div className="tab-content-wrapper desktop-only">
                    <div className="tabs">
                        <p className="tab" data-tab=".solar-system" data-tab-name="solarSystem"
                           data-position="left" data-state={activeTab === 'solarSystem' && 'active'} data-line-target="tabLine" onClick={() => this.onSwitchTab('solarSystem')}>Solar System</p>
                        <p className="tab" data-tab=".about-us" data-tab-name="aboutUs" data-position="right"
                           data-state={activeTab === 'aboutUs' && 'active'} data-line-target="tabLine" onClick={() => this.onSwitchTab('aboutUs')}>About</p>
                    </div>
                    <div id="tabLine" className="active" ref={ref => this.tabLine = ref} />
                </div>
                {this.walletStore.connected ? (
                    <div className="pocket" onClick={() => this.uiStore.showProfile(this.walletStore.account)}>
                        <div className="pocket-icon btn btn-box btn-creditcard-purple"/>
                        <div className="pocket-amount">{this.walletStore.rtBalance?.toFixed(2)}</div>
                        <div className="pocket-symbol">NFTm</div>
                    </div>
                ) : (
                    <button type="button" name="button" onClick={this.onSignIn}
                            className="btn btn-green btn-rectangle btn-avatar desktop-only">
                        <img src={require('../static/images/avatars/metamask.png')} alt="metamask" />
                        <span className="text">Sign IN</span>
                    </button>
                )}
                <div className={classNames('nav-btn', 'mobile-only', { active: mobileMenuVisible })} onClick={() => this.uiStore.toggleMobileMenu()}>
                    <div className="bg"/>
                    <div className="line-1"/>
                    <div className="line-2"/>
                    <div className="line-3"/>
                </div>
            </header>
        )
    }
}

export const Header = withTranslation()(HeaderComponent)