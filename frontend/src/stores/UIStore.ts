import { injectable } from "inversify";
import { RootStore } from "./RootStore";
import { action, makeObservable, observable, reaction, runInAction } from "mobx";
import Timeout from "await-timeout";
import { ADAPTIVE_BREAKPOINT, COUNTRY_DATA } from "../utils/const";
import { Action, Location } from "history";
import { CountryData } from "../utils/types";
import { CountryType } from "../utils/graphql";

export type ActiveTab = 'solarSystem' | 'aboutUs';
export enum PlanetsEnum {
    mercury = -1,
    venus,
    earth,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
}

type Modals = 'moreInfo' | 'continent' | 'metamask';

@injectable()
export class UIStore {
    @observable aboveBreakpoint: boolean = true;

    @observable activeTabTransitioning: boolean = false;
    @observable activeTab: ActiveTab = 'solarSystem';
    @observable activeTabDelayed: ActiveTab = 'solarSystem';

    @observable activePlanet?: PlanetsEnum;
    @observable activePlanetDelayed?: PlanetsEnum;
    @observable solarSystemStatus: 'zoom-out' | 'zoom-in-step-1' | 'zoom-in' = 'zoom-out';
    @observable zoomOutTransitioningStep: number = 0;
    @observable spaceSwitching: boolean = false;

    @observable showPlanetContent?: PlanetsEnum;

    @observable mobileMenuVisible: boolean = false;
    @observable mobileMenuTransitioning: boolean = false;
    @observable mobileVisiblePlanet: PlanetsEnum = PlanetsEnum.earth;

    @observable openModal?: Modals;
    @observable openModalDelayed?: Modals;
    @observable activeAccount?: string;
    @observable activeCountry?: CountryType;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        this.init();
    }

    @action init = () => {
        window.addEventListener('resize', this.checkBreakpoint);
        this.checkBreakpoint();
        reaction(() => this.rootStore.navigation.location, this.onRouteChange);

        const pathname = this.rootStore.navigation.location.pathname;
        if (pathname === '/aboutUs') {
            this.activeTab = this.activeTabDelayed = 'aboutUs';
        } else if (/^\/planets\/.+/.test(pathname)) {
            const name = pathname.match(/^\/planets\/([^\/]+)/)[1];
            const planet = PlanetsEnum[name];
            if (!planet) {
                this.rootStore.history.replace('/');
            } else {
                this.activePlanet = this.activePlanetDelayed = this.showPlanetContent = PlanetsEnum[name];
                this.solarSystemStatus = 'zoom-in';
                if (/^\/planets\/earth\/.+$/.test(pathname)) {
                    const number = parseInt(pathname.match(/^\/planets\/earth\/([^\/]+)/)[1]);
                    this.rootStore.entityStore.readyPromise.promise.then(() => this.showCountry(this.rootStore.entityStore.countriesMap[number], true));
                }
            }
        } else {
            this.rootStore.history.replace('/');
        }
    }

    @action onRouteChange = (cur: Location) => {
        const pathname: string = cur.pathname;
        if (pathname === '/aboutUs') {
            this.toggleTab('aboutUs', true);
        } else {
            this.toggleTab('solarSystem', true);
        }

        if (pathname === '/') {
            this.zoomOutPlanets(true);
            this.hideModals();
        } else {
            const match = pathname.match(/^\/planets\/([^\/]+)/);
            if (match) {
                const name = match[1];
                const planet = PlanetsEnum[name];
                if (!planet) {
                    this.rootStore.history.replace('/');
                } else {
                    this.zoomInPlanet(PlanetsEnum[name], true);
                    if (/^\/planets\/earth\/.+$/.test(pathname)) {
                        const number = parseInt(pathname.match(/^\/planets\/earth\/([^\/]+)/)[1]);
                        this.rootStore.entityStore.readyPromise.promise.then(() => this.showCountry(this.rootStore.entityStore.countriesMap[number], true));
                    } else {
                        this.hideModals(true);
                    }
                }
            }
        }
    }

    @action checkBreakpoint = () => {
        this.aboveBreakpoint = window.outerWidth > ADAPTIVE_BREAKPOINT;
    }

    toggleTab = async (tab: ActiveTab, history: boolean = false) => {
        // if (tab === this.activeTab && tab !== 'solarSystem')
        //     return;

        if (this.mobileMenuVisible)
            this.toggleMobileMenu();

        switch (tab) {
            case 'solarSystem':
                !history && this.rootStore.history.push('/');
                if (!history || history && this.rootStore.history.location.pathname === '/') {
                    this.zoomOutPlanets(history);
                    this.hideModals();
                }
                break;
            case 'aboutUs':
                !history && this.rootStore.history.push('/aboutUs');
                break;
        }

        runInAction(() => { this.activeTab = tab; this.activeTabTransitioning = true; });
        await Timeout.set(30);
        runInAction(() => this.activeTabDelayed = tab);
        await Timeout.set(300);
        runInAction(() => this.activeTabTransitioning = false);
    }

    zoomInPlanet = async (planet: PlanetsEnum, history: boolean = false) => {
        !history && this.rootStore.history.push(`/planets/${PlanetsEnum[planet]}`)
        const zoomedOut = this.solarSystemStatus === 'zoom-out';
        if (zoomedOut) {
            runInAction(() => this.solarSystemStatus = 'zoom-in-step-1');
            await Timeout.set(200);
            runInAction(() => this.solarSystemStatus = 'zoom-in');
        }
        runInAction(() => this.activePlanet = this.activePlanetDelayed = planet);
        setTimeout(() => runInAction(() => this.showPlanetContent = planet), 300);
        if (!zoomedOut) {
            runInAction(() => this.spaceSwitching = true);
            await Timeout.set(300);
            runInAction(() => this.spaceSwitching = false);
        }
    }

    zoomOutPlanets = async (history: boolean = false) => {
        !history && this.rootStore.history.push('/');
        runInAction(() => { this.activePlanet = undefined; this.zoomOutTransitioningStep = 1; this.showPlanetContent = undefined; });
        await Timeout.set(150);
        runInAction(() => { this.zoomOutTransitioningStep = 2; this.solarSystemStatus = 'zoom-out'; });
        await Timeout.set(300);
        runInAction(() => { this.zoomOutTransitioningStep = 0; this.activePlanetDelayed = undefined; });
    }

    @action togglePlanetContent = (planet: PlanetsEnum) => {
        if (this.showPlanetContent === planet)
            this.showPlanetContent = undefined;
        else
            this.showPlanetContent = planet;
    }

    toggleMobileMenu = async () => {
        if (this.mobileMenuTransitioning)
            return;
        runInAction(() => this.mobileMenuTransitioning = true);
        await Timeout.set(0);
        runInAction(() => this.mobileMenuVisible = !this.mobileMenuVisible);
        await Timeout.set(500);
        runInAction(() => this.mobileMenuTransitioning = false);
    }

    @action swipePlanetsMobile = (dir: number) => {
        if (typeof this.activePlanet !== "undefined" || this.showPlanetContent)
            return;
        if (dir > 0) {
            if (this.mobileVisiblePlanet === PlanetsEnum.neptune)
                return;
        } else {
            if (this.mobileVisiblePlanet === PlanetsEnum.mercury)
                return;
        }
        this.mobileVisiblePlanet += dir;
    }

    showModal = async (modal: Modals) => {
        if (this.openModal) {
            runInAction(() => this.openModalDelayed = undefined);
            await Timeout.set(150);
        }
        runInAction(() => this.openModal = modal);
        await Timeout.set(10);
        runInAction(() => this.openModalDelayed = modal);
    }

    hideModals = async (history: boolean = false) => {
        if (this.openModal === 'continent')
            !history && this.rootStore.history.push(`/planets/${PlanetsEnum[this.activePlanet]}`);

        runInAction(() => this.openModalDelayed = undefined);
        await Timeout.set(300);
        runInAction(() => this.openModal = undefined);
    }

    @action showCountry = (country: CountryType, history: boolean = false) => {
        this.activeCountry = country;
        this.showModal('continent');
        !history && this.rootStore.history.push(`/planets/${PlanetsEnum[this.activePlanet]}/${country.number}`);
    }

    @action showProfile = (address: string) => {
        this.activeAccount = address;
        this.showModal('moreInfo');
    }
}
