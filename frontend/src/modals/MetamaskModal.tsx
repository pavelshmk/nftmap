import React from 'react';
import classNames from "classnames";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { UIStore } from "../stores";

interface IMetamaskModalProps {
}

interface IMetamaskModalState {
}

@observer
class MetamaskModal extends React.Component<IMetamaskModalProps, IMetamaskModalState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    render() {
        const { openModalDelayed, openModal } = this.uiStore;

        return (
            <div id="metamaskPopup" className={classNames('metamask', 'metamask-popup', { show: openModalDelayed === 'metamask' })} style={{ display: openModal === 'metamask' && 'block' }}>
                <div className="metamask-wrapper">
                    <div className="metamask-image">
                        <img src={require('../static/images/avatars/metamask-big.png')} alt="Metamask" />
                    </div>
                    <div className="metamask-title">
                        Ethereum Wallet Not Detected
                    </div>
                    <div className="metamask-btn">
                        <button className="btn btn-green-2 btn-rectangle btn-buy">Get Metamask</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default MetamaskModal;