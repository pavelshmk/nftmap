import { makeObservable, observable, runInAction } from "mobx";
import { CountryType, PlanetType } from "../utils/graphql";
import { RootStore } from "./RootStore";
import { PlanetsEnum } from "./UIStore";
import defer from "defer-promise";

export class EntityStore {
    @observable ready: boolean = false;
    @observable readyPromise = defer();
    @observable planets: PlanetType[];
    @observable countries: CountryType[];
    @observable planetsMap: { [planet: number]: PlanetType } = {};
    @observable countriesMap: { [planet: number]: CountryType } = {};
    @observable maxCountryPrice: number;
    @observable mintedCountries: string[] = [];
    @observable mintedPlanets: string[] = [];

    constructor(protected readonly rootStore: RootStore) {
        makeObservable(this);
        this.loadEntities();
    }

    loadEntities = async () => {
        const entities = await this.rootStore.api.getEntities();
        runInAction(() => {
            this.countries = entities.countries;
            this.planets = entities.planets;
            for (const planet of this.planets) {
                this.planetsMap[PlanetsEnum[planet.enum]] = planet;
            }
            for (const country of this.countries) {
                this.countriesMap[country.number] = country;
            }
            this.maxCountryPrice = parseInt(entities.maxCountryPrice);
            this.ready = true;
            this.readyPromise.resolve(null);
        });

        const nft = this.rootStore.walletStore.nftTokenContract;
        const mintedCountries = await nft.methods.countriesMinted().call();
        const mintedPlanets = await nft.methods.planetsMinted().call();
        runInAction(() => {
            this.mintedPlanets = mintedPlanets;
            this.mintedCountries = mintedCountries;
        })
    }
}