import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: any;
};

export type CountryType = {
  area: Scalars['Decimal'];
  code: Scalars['String'];
  cryptoIndex: Scalars['Int'];
  emission: Scalars['Decimal'];
  gdp: Scalars['Decimal'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  number: Scalars['Int'];
  population: Scalars['Decimal'];
  price: Scalars['Decimal'];
  tokenId: Scalars['Int'];
};


export type EntityType = {
  image?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
};

export type PlanetType = {
  emission: Scalars['Decimal'];
  enum: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['Int'];
  price: Scalars['Decimal'];
  sunDistance: Scalars['Decimal'];
  tokenId: Scalars['Int'];
  weight: Scalars['Decimal'];
};

export type Query = {
  countries?: Maybe<Array<CountryType>>;
  entitiesInfo?: Maybe<Array<Maybe<EntityType>>>;
  maxCountryPrice?: Maybe<Scalars['Decimal']>;
  planets?: Maybe<Array<PlanetType>>;
  tokenMintArgs?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type Query_EntitiesInfoArgs = {
  tokenIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type Query_TokenMintArgsArgs = {
  buyer?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['Int']>;
};

export type GetEntitiesVariables = Exact<{ [key: string]: never; }>;


export type GetEntities = (
  Pick<Query, 'maxCountryPrice'>
  & { planets?: Maybe<Array<Pick<PlanetType, 'enum' | 'name' | 'number' | 'price' | 'sunDistance' | 'tokenId' | 'weight' | 'emission'>>>, countries?: Maybe<Array<Pick<CountryType, 'area' | 'code' | 'cryptoIndex' | 'gdp' | 'image' | 'name' | 'number' | 'population' | 'price' | 'tokenId' | 'emission'>>> }
);

export type TokenMintArgsVariables = Exact<{
  buyer: Scalars['String'];
  tokenId: Scalars['Int'];
}>;


export type TokenMintArgs = Pick<Query, 'tokenMintArgs'>;

export type EntitiesInfoVariables = Exact<{
  tokenIds?: Maybe<Array<Maybe<Scalars['String']>> | Maybe<Scalars['String']>>;
}>;


export type EntitiesInfo = { entitiesInfo?: Maybe<Array<Maybe<Pick<EntityType, 'name' | 'image' | 'tokenId' | 'link'>>>> };


export const GetEntitiesDocument = gql`
    query getEntities {
  planets {
    enum
    name
    number
    price
    sunDistance
    tokenId
    weight
    emission
  }
  countries {
    area
    code
    cryptoIndex
    gdp
    image
    name
    number
    population
    price
    tokenId
    emission
  }
  maxCountryPrice
}
    `;
export const TokenMintArgsDocument = gql`
    query tokenMintArgs($buyer: String!, $tokenId: Int!) {
  tokenMintArgs(buyer: $buyer, tokenId: $tokenId)
}
    `;
export const EntitiesInfoDocument = gql`
    query entitiesInfo($tokenIds: [String]) {
  entitiesInfo(tokenIds: $tokenIds) {
    name
    image
    tokenId
    link
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(variables?: GetEntitiesVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEntities> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEntities>(GetEntitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities');
    },
    tokenMintArgs(variables: TokenMintArgsVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TokenMintArgs> {
      return withWrapper((wrappedRequestHeaders) => client.request<TokenMintArgs>(TokenMintArgsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tokenMintArgs');
    },
    entitiesInfo(variables?: EntitiesInfoVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntitiesInfo> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntitiesInfo>(EntitiesInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entitiesInfo');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;