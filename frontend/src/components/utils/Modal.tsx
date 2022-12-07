import React from 'react';
import { inject, observer } from "mobx-react";
import { Modals, ModalStore, PERSISTENT_MODALS } from "../../stores/ModalStore";
import { resolve } from "inversify-react";
import { ScrollLock } from "./ScrollLock";
import classNames from "classnames";

interface IModalProps {
    modalClassName?: string;
    wrapClassName?: string;
    children: React.ReactNode | React.ReactNodeArray;
    show?: boolean;
    onHide?: () => any;
    modalKey?: Modals;
}

interface IModalState {
}

@observer
export class Modal extends React.Component<IModalProps, IModalState> {
    @resolve(ModalStore)
    declare private readonly modalStore: ModalStore;

    hide = () => {
        if (PERSISTENT_MODALS.includes(this.props.modalKey))
            return;
        this.props.onHide ? this.props.onHide() : this.modalStore.hideModals();
    }

    render() {
        let { modalClassName, wrapClassName, children, show, modalKey } = this.props;

        if (!show && modalKey)
            show = this.modalStore.activeModal === modalKey;

        return (
            <>
                {show && <ScrollLock />}
                <div className={classNames('base-popup', 'mask', { active: show }, wrapClassName)} onClick={this.hide}>
                    <div className={classNames('base-popup__drop', { active: show }, modalClassName)} onClick={e => e.stopPropagation()}>
                        {children}
                        {!PERSISTENT_MODALS.includes(modalKey) && (
                            <a className='js-close' onClick={() => this.modalStore.hideModals()}>
                                <img src={require('../images/icons/icon-close.svg')} alt=""/>
                            </a>
                        )}
                    </div>
                </div>
            </>
        )
    }
}
