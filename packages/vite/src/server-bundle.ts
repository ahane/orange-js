import { Manifest, Plugin } from "vite";
import { ConfigFn, Context } from "./index.js";
import { VirtualModule } from "./virtual-module.js";
import { mapObject, unreachable } from "./util.js";
import dedent from "dedent";
import { RouteManifest, RouteManifestEntry } from "./routes.js";
import { devAssets, releaseAssets } from "./assets.js";

const routesVirtualId = new VirtualModule("server-bundle");

/*
This plugin is responsible for generating a `ServerBuild` object from React-Router
so that we can re-use their SSR modules.
*/
export function serverBundle(config: ConfigFn, ctx: Context): Plugin {
  return {
    name: "orange:server-bundle",
    enforce: "pre",
    resolveId(id) {
      if (routesVirtualId.is(id)) {
        return routesVirtualId.id;
      }
    },
    async load(id) {
      if (!routesVirtualId.is(id)) {
        return;
      }

      const { routes } = config();

      const routeImports = Object.values(routes).map(
        (route, index) => `import * as routeModule${index} from "/${route.file}";`
      );
      const routeLiterals = Object.values(routes).map(
        (route, index) => `"${route.id}": {
          id: ${JSON.stringify(route.id)},
          parentId: ${JSON.stringify(route.parentId)},
          path: ${JSON.stringify(route.path)},
          index: ${JSON.stringify(route.index)},
          caseSensitive: true,
          module: routeModule${index},
        }`
      );

      const assets = ctx.clientManifest ? releaseAssets(ctx) : devAssets(ctx);

      return dedent`
      import * as serverModule from "@orange-js/orange/server-entry";

      ${routeImports.join("\n")}

      export const entry = { module: serverModule };
      export const future = { unstable_optimizeDeps: false };
      export const basename = "/";
      export const publicPath = "/";
      export const isSpaMode = false;
      export const assetsBuildDirectory = "dist/client";
      export const assets = ${JSON.stringify(assets)};
      export const routes = {${routeLiterals.join(",")}};
      `;
    },
  };
}
