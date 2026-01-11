export const buildTenantUrl = (tenantName: string) => {
  const tenantUrl = process.env.VIVOLLO_TENANT_URL;

  if (!tenantUrl) {
    throw new Error("Missing VIVOLLO_TENANT_URL environment variable");
  }

  return tenantUrl.replace("{tenant}", tenantName);
};

export const getTenantUrl = (tenantName: string, path: string = "") => {
  return buildTenantUrl(tenantName) + path;
};
