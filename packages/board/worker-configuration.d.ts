// Generated by Wrangler by running `wrangler types`

interface Env {
  SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  BASE_URL: string;
  Draw: DurableObjectNamespace /* Draw */;
  images: R2Bucket;
  USERS_DATABASE: D1Database;
  ScreenshotWorkflow: Workflow;
}

declare module "~/routes/board.$owner.$id.content" {
  export interface RouteInfo {
    info: "10";
  }
}
