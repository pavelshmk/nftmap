import { GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "./graphql";

export class Api {
    client: GraphQLClient;
    sdk: Sdk;

    constructor() {
        this.client = new GraphQLClient(`http://dev.bennnnsss.com:25678/graphql`);
        this.sdk = getSdk(this.client);
    }

    getEntities = async  () => {
        return await this.sdk.getEntities();
    }

    getMintArgs = async (buyer: string, tokenId: number) => {
        return await this.sdk.tokenMintArgs({ buyer, tokenId });
    }

    getEntitiesInfo = async (tokenIds: string[]) => {
        return this.sdk.entitiesInfo({ tokenIds });
    }
}
