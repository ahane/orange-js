import { Manifest, ManifestChunk } from "vite";
import { Context } from "./index.js";
import { RouteManifestEntry } from "./routes.js";
import { mapObject, unreachable } from "./util.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

export function writeAssets(path: string, ctx: Context) {
  fs.writeFileSync(
    path,
    `window.__reactRouterManifest = ${JSON.stringify(assets(ctx), null, 2)}`
  );
}

export function assets(ctx: Context) {
  const routes = ctx.routes ?? unreachable();
  const manifest = ctx.clientManifest ?? unreachable();

  const assetRoutes = mapObject(routes, (route) =>
    mapManifestRoute(route, manifest)
  );

  const entryChunk =
    Object.values(manifest).find((it) => it.isEntry) ?? unreachable();
  const entry = {
    module: prependSlash(entryChunk.file),
    imports: resolve(manifest, entryChunk.imports),
    css: resolve(manifest, entryChunk.css),
  };

  const version = crypto
    .createHash("sha256")
    .update(JSON.stringify({ entry, routes }))
    .digest("hex")
    .slice(0, 8);

  return {
    entry,
    routes: assetRoutes,
    url: `/assets/manifest-${version}.js`,
    version,
  };
}

function mapManifestRoute(route: RouteManifestEntry, manifest: Manifest) {
  const chunk = manifest[route.file];

  return {
    id: route.id,
    parentId: route.parentId,
    path: route.path,
    index: route.index ?? false,
    caseSensitive: true,
    hasLoader: route.hasLoader ?? false,
    hasAction: route.hasAction ?? false,
    hasClientLoader: route.hasClientLoader ?? false,
    hasClientAction: route.hasClientAction ?? false,
    hasErrorBoundary: route.hasErrorBoundary ?? false,
    module: prependSlash(chunk.file),
    imports: resolve(manifest, chunk.imports),
    css: resolve(manifest, chunk.css),
  };
}

const prependSlash = (it: string) => "/" + it;

function resolve(manifest: Manifest, items: string[] | undefined): string[] {
  const unresolved = items ?? [];

  return unresolved.map((it) => {
    const chunk = manifest[it];
    if (!chunk) {
      throw new Error(`Could not find chunk "${it}" in manifest`);
    }

    return "/" + chunk.file;
  });
}
