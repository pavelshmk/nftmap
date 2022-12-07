import React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { UIStore } from "../stores";
import classNames from "classnames";

interface IAboutUsProps extends WithTranslation {
}

interface IAboutUsState {
}

@observer
class AboutUsComponent extends React.Component<IAboutUsProps, IAboutUsState> {
    @resolve(UIStore)
    declare protected readonly uiStore: UIStore;

    render() {
        const { t } = this.props;
        const { activeTabDelayed, activeTabTransitioning } = this.uiStore;

        return (
            <section className={classNames('about-us', { 'active-tab': activeTabDelayed === 'aboutUs' })} style={{ display: activeTabTransitioning ? 'block' : '' }}>
                <div className="provenance">
                    <div className="provenance-wrapper">
                        <div className="provenance-title">NTFmap Provenance Record</div>
                        <div className="provenance-text">
                            This page presents the provenance record of each Hashmask that will ever exist. Each full
                            resolution Hashmask image is firstly hashed using SHA-256 algorithm. A combined string is
                            obtained by concatenating SHA-256 of each Hashmask image in the specific order as listed
                            below. The final proof is obtained by SHA-256 hashing this combined string. This is the
                            final provenance record stored on the smart contract
                        </div>
                        <div className="provenance-verify">
                            <div className="provenance-verify-title">Finalized Starting Index: 10141</div>
                            <div className="provenance-verify-text">Each Hashmask token ID is assigned to an artwork
                                image from the original sequence with this formula: (tokenId + startingIndex) % 16384 =&gt;
                                Image Index From the Original Sequence
                            </div>
                            <div className="provenance-verify-contracts">
                                <div className="provenance-verify-contracts-item">
                                    <span>NFTM Contract Address:</span>
                                    <a href="#">0xc2c747e0f7004f9e8817db2ca4997657a7746928</a>
                                </div>
                                <div className="provenance-verify-contracts-item">
                                    <span>NFTM Contract Address:</span>
                                    <a href="#">0xc2c747e0f7004f9e8817db2ca4997657a7746928</a>
                                </div>
                                <div className="provenance-verify-contracts-item">
                                    <span>Final Proof Hash:</span>
                                    <div
                                        className="proof-hash">df760c771ad006eace0d705383b74158967e78c6e980b35f670249b5822c42e1
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="provenance-subtitle">Concatenated Hash String</div>
                        <div className="provenance-text">The table below lists the original index, assigned Hashmask
                            Token ID, SHA256 Hash output and IPFS link of each Hashmask image
                        </div>

                        <div className="provenance-list">
                            <div className="provenance-descr">
                                Initial Sequence Index - Assigned Token ID - SHA-256 - CDN Link
                            </div>
                            <div className="table-wrapper">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>0001</td>
                                            <td><a href="#">6424</a></td>
                                            <td>59c383c5f52aa7a12ffe6ff441edaf44ced8b22886833b67dd96c00b314a2f87</td>
                                            <td><a href="#">QmTpER2v89GyzBuTESED1zQKK3Kw1o1b9rFN2SQGtiHMY4</a></td>
                                        </tr>
                                        <tr>
                                            <td>0001</td>
                                            <td><a href="#">6424</a></td>
                                            <td>59c383c5f52aa7a12ffe6ff441edaf44ced8b22886833b67dd96c00b314a2f87</td>
                                            <td><a href="#">QmTpER2v89GyzBuTESED1zQKK3Kw1o1b9rFN2SQGtiHMY4</a></td>
                                        </tr>
                                        <tr>
                                            <td>0001</td>
                                            <td><a href="#">6424</a></td>
                                            <td>59c383c5f52aa7a12ffe6ff441edaf44ced8b22886833b67dd96c00b314a2f87</td>
                                            <td><a href="#">QmTpER2v89GyzBuTESED1zQKK3Kw1o1b9rFN2SQGtiHMY4</a></td>
                                        </tr>
                                        <tr>
                                            <td>0001</td>
                                            <td><a href="#">6424</a></td>
                                            <td>59c383c5f52aa7a12ffe6ff441edaf44ced8b22886833b67dd96c00b314a2f87</td>
                                            <td><a href="#">QmTpER2v89GyzBuTESED1zQKK3Kw1o1b9rFN2SQGtiHMY4</a></td>
                                        </tr>
                                        <tr>
                                            <td>0001</td>
                                            <td><a href="#">6424</a></td>
                                            <td>59c383c5f52aa7a12ffe6ff441edaf44ced8b22886833b67dd96c00b314a2f87</td>
                                            <td><a href="#">QmTpER2v89GyzBuTESED1zQKK3Kw1o1b9rFN2SQGtiHMY4</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const AboutUs = withTranslation()(AboutUsComponent);
export default AboutUs;