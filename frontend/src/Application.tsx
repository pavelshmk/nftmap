import React  from 'react';
import { Router } from "react-router-dom";
import { RootStore } from "./stores";
import { ToastContainer } from "react-toastify";
import { Provider } from "inversify-react";
import { Header } from "./components/Header";
import { Modals } from "./modals";
import Footer from "./components/Footer";
import Background from "./components/Background";
import AboutUs from "./components/AboutUs";
import SolarSystem from "./components/SolarSystem";

export const rootStore = new RootStore();
const container = rootStore.container

class Application extends React.Component {
    componentDidMount() {
        // rootStore.walletStore.tryReconnect();
    }

    render() {
        return (
            <Provider container={container}>
                <>
                    <ToastContainer/>

                    <Header />
                    <SolarSystem />
                    <Background />
                    <AboutUs />
                    <Footer />

                    <Modals />
                </>
            </Provider>
        );
    }
}

export default Application;
