import React from 'react';
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { EntityStore, UIStore, WalletStore } from "../stores";
import classNames from "classnames";
import Timeout from "await-timeout";
import ContinentModal from "./ContinentModal";
import WalletInfoModal from "./WalletInfoModal";
import MetamaskModal from "./MetamaskModal";
import NavModal from "./NavModal";

interface IModalsState {
}

@observer
export class Modals extends React.Component<{}, IModalsState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    state: IModalsState = {
    }

    render() {
        const { openModalDelayed, openModal } = this.uiStore;

        return (
            <div className="modals">
                <ContinentModal />
                <WalletInfoModal />
                <MetamaskModal />
                <NavModal />
                <div
                    data-close-popup="metamaskPopup"
                    className={classNames('popup-background', { show: openModalDelayed })}
                    style={{ display: openModal && 'block' }}
                    onClick={() => this.uiStore.hideModals()}
                />
            </div>
        )
    }
}
