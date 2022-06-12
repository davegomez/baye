/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [
    /^bail.*/,
    /^character-entities.*/,
    /^decode-named-character-reference.*/,
    /^env-paths.*/,
    /^longest-streak.*/,
    /^mdast-util-from-markdown.*/,
    /^mdast-util-to-markdown.*/,
    /^mdast-util-to-string.*/,
    /^micromark-util-decode-numeric-character-reference.*/,
    /^micromark-util-decode-string.*/,
    /^micromark-util-normalize-identifier.*/,
    /^micromark.*/,
    /^remark.*/,
    /^trough.*/,
    /^unified.*/,
    /^unist-util-is.*/,
    /^unist-util-stringify-position.*/,
    /^unist-util-visit.*/,
    /^vfile.*/,
    /^zwitch.*/,
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}
