import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro";
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
  // pnpm uses symlinks; Metro must resolve through them in this monorepo.
  config.resolver.disableHierarchicalLookup = true;
  config.resolver.unstable_enableSymlinks = true;
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "iconsax-react-nativejs": path.resolve(projectRoot, "node_modules/iconsax-react-nativejs"),
  };
}

export default withNativeWind(config, { input: "./src/global.css" });
