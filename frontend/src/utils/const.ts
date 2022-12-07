import { PlanetsEnum } from "../stores/UIStore";
import { CountryData, PlanetInfo } from "./types";
import TokensJson from '../../../tokens2.json';
import { toBNJS } from "./utilities";

export const TEST_NETWORK = true;
export const CHAIN_ID = TEST_NETWORK ? 97 : 56;  // 3 = ropsten, 1 = mainnet, 97 = bsc test, 56 = bsc main
export const REWARD_TOKEN_CONTRACT = '0x061599693665F2e0A467529eB2119E21Dbf64291';
export const NFT_TOKEN_CONTRACT = '0x9D39c12fF663E0B918c41C33436bC9D8dD6024fD';

export const ADAPTIVE_BREAKPOINT = 799;

export const PLANET_DATA: { [planet: number]: PlanetInfo } = {
    [PlanetsEnum.mercury]: TokensJson.planets[0],
    [PlanetsEnum.venus]: TokensJson.planets[1],
    [PlanetsEnum.earth]: TokensJson.planets[1],
    [PlanetsEnum.mars]: TokensJson.planets[2],
    [PlanetsEnum.jupiter]: TokensJson.planets[3],
    [PlanetsEnum.saturn]: TokensJson.planets[4],
    [PlanetsEnum.uranus]: TokensJson.planets[5],
    [PlanetsEnum.neptune]: TokensJson.planets[6],
}

export const PLANET_ORDER = [PlanetsEnum.mercury, PlanetsEnum.venus, PlanetsEnum.earth, PlanetsEnum.mars, PlanetsEnum.jupiter, PlanetsEnum.saturn, PlanetsEnum.uranus, PlanetsEnum.neptune];

export const COUNTRY_DATA: CountryData[] = TokensJson.countries;

export const COUNTRY_EMISSION = (country: CountryData) => toBNJS(0)
    .plus(toBNJS(country.gdp).div('1e7'))
    .plus(toBNJS(country.area).div('1e3'))
    .plus(toBNJS(country.population).div('1e3').times(country.cryptoIndex));
