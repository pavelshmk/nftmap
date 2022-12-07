import * as stores from './';
import { Container } from 'inversify';
import { createBrowserHistory, History } from "history";
import { createObservableHistory } from "mobx-observable-history";
import { ObservableHistory } from "mobx-observable-history";
import { Api } from "../utils/api";

export class RootStore {
    public history: History;
    public navigation: ObservableHistory;
    public walletStore: stores.WalletStore;
    public uiStore: stores.UIStore;
    public entityStore: stores.EntityStore;

    public api: Api;

    public container: Container;

    public constructor() {
        this.api = new Api();
        this.entityStore = new stores.EntityStore(this);
        this.history = createBrowserHistory();
        this.navigation = createObservableHistory();
        this.walletStore = new stores.WalletStore(this);
        this.uiStore = new stores.UIStore(this);

        this.container = new Container();
        // this.container.bind(History).toConstantValue(this.history);
        this.container.bind(ObservableHistory).toConstantValue(this.navigation);
        this.container.bind(stores.WalletStore).toConstantValue(this.walletStore);
        this.container.bind(stores.UIStore).toConstantValue(this.uiStore);
        this.container.bind(stores.EntityStore).toConstantValue(this.entityStore);
        this.container.bind(Api).toConstantValue(this.api);
    }
}
