/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type GetShopIdQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetShopIdQuery = { shop: Pick<AdminTypes.Shop, 'id'> };

export type MetafieldsSetMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
}>;


export type MetafieldsSetMutation = { metafieldsSet?: AdminTypes.Maybe<{ metafields?: AdminTypes.Maybe<Array<Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key'>>>, userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'field' | 'message'>> }> };

export type GetMainThemeAndSettingsDataQueryVariables = AdminTypes.Exact<{
  filenames: Array<AdminTypes.Scalars['String']['input']> | AdminTypes.Scalars['String']['input'];
}>;


export type GetMainThemeAndSettingsDataQuery = { themes?: AdminTypes.Maybe<{ edges: Array<{ node: (
        Pick<AdminTypes.OnlineStoreTheme, 'id'>
        & { files?: AdminTypes.Maybe<{ nodes: Array<(
            Pick<AdminTypes.OnlineStoreThemeFile, 'filename'>
            & { body: Pick<AdminTypes.OnlineStoreThemeFileBodyText, 'content'> }
          )> }> }
      ) }> }> };

interface GeneratedQueryTypes {
  "#graphql\n      query GetShopId {\n        shop { id }\n      }": {return: GetShopIdQuery, variables: GetShopIdQueryVariables},
  "#graphql\n      query GetMainThemeAndSettingsData($filenames: [String!]!) {\n        themes(first: 10, roles: [MAIN]) {\n          edges {\n            node {\n              id\n              files(filenames: $filenames, first: 1) {\n                nodes {\n                  filename\n                  body {\n                    ... on OnlineStoreThemeFileBodyText { content }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }": {return: GetMainThemeAndSettingsDataQuery, variables: GetMainThemeAndSettingsDataQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n        metafieldsSet(metafields: $metafields) {\n          metafields { id namespace key }\n          userErrors { field message }\n        }\n      }": {return: MetafieldsSetMutation, variables: MetafieldsSetMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
