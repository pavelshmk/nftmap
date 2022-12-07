import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
import { resolve } from "inversify-react";
import { UIStore } from "../stores";
import { observer } from "mobx-react";

interface IFooterProps extends WithTranslation {
}

interface IFooterState {
}

@observer
class FooterComponent extends React.Component<IFooterProps, IFooterState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    render() {
        const { t } = this.props;
        const activeTab = this.uiStore.activeTab;

        return (
            <footer className={classNames({ 'background-blur': activeTab === 'aboutUs' })}>
                <div className="social">
                    <p className="text">Follow us</p>
                    <a href="#" className="btn btn-box btn-twitter disabled"/>
                    <a href="#" className="btn btn-box btn-telegram disabled"/>
                </div>
            </footer>

        )
    }
}

const Footer = withTranslation()(FooterComponent);
export default Footer;