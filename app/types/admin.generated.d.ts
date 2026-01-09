/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type FindOrdersQueryVariables = AdminTypes.Exact<{
  query: AdminTypes.Scalars['String']['input'];
}>;


export type FindOrdersQuery = { orders: { nodes: Array<(
      Pick<AdminTypes.Order, 'id' | 'name' | 'email' | 'createdAt' | 'displayFinancialStatus' | 'displayFulfillmentStatus' | 'statusPageUrl'>
      & { currentSubtotalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, fulfillments: Array<{ trackingInfo: Array<Pick<AdminTypes.FulfillmentTrackingInfo, 'url' | 'number' | 'company'>> }> }
    )> } };

interface GeneratedQueryTypes {
  "#graphql\n  query findOrders($query: String!) {\n    orders(first: 5, query: $query, sortKey: CREATED_AT, reverse: true) {\n      nodes {\n        id\n        name\n        email\n        createdAt\n        displayFinancialStatus\n        displayFulfillmentStatus\n        currentSubtotalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        statusPageUrl\n        fulfillments {\n            trackingInfo {\n                url\n                number\n                company\n            }\n        }\n      }\n    }\n  }\n": {return: FindOrdersQuery, variables: FindOrdersQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
