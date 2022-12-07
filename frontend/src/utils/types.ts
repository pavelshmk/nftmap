import { JsonProperty, Serializable } from "typescript-json-serializer";
import { DateTime } from "luxon";

const DATETIME_PROPERTY = { onDeserialize: (val: string) => DateTime.fromISO(val) }
const DECIMAL_PROPERTY = { onDeserialize: (val: string) => parseFloat(val) }

export interface PlanetInfo {
    number: string;
    name: string;
    tokenId: string;
    sunDistance: string;
    priceEth: string;
    weight: string;
}

export interface CountryData {
    number: string;
    name: string;
    tokenId: string;
    code: string;
    gdp: string;
    area: string;
    population: string;
    cryptoIndex: string;
}

export const ETH_PRICE = 3959.74;
