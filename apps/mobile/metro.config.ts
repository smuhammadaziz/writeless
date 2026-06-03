import { getDefaultConfig } from "expo/metro-config";
import path from "path";

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
if (config.resolver) {
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];
  config.resolver.disableHierarchicalLookup = true;
}

export default config;
