import api from "app/services/api.server";
import { AxiosError } from "axios";

export class CollectionService {
  static async getCollectionGroups(vivolloAccessToken: string, tenantName: string) {
    const response = await api.get("/collection-groups", {
      headers: {
        Authorization: `Bearer ${vivolloAccessToken}`,
        "X-Tenant": tenantName,
      },
    });

    return response.data;
  }

  static async syncCollectionGroup(
    vivolloAccessToken: string,
    tenantName: string,
    collectionGroupId: string
  ) {
    const headers = {
      Authorization: `Bearer ${vivolloAccessToken}`,
      "X-Tenant": tenantName,
    };

    try {
      const collectorsResponse = await api.get(
        `/collection-groups/${collectionGroupId}/document-collectors`,
        { headers }
      );

      const collectors = collectorsResponse.data?.data;

      if (!collectors || collectors.length === 0) {
        throw new Error("No collectors found");
      }

      await api.post(`/document-collectors/${collectors[0].id}/sync`, {}, { headers });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to sync collectors");
      }
      throw error;
    }
  }
}
