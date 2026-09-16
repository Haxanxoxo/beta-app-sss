const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo (packages folder)
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve node_modules
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Map our @config and @shared aliases so Metro can resolve them at RUNTIME
//    (tsconfig paths only help the TS compiler, not Metro)
config.resolver.extraNodeModules = {
    '@config': path.resolve(workspaceRoot, 'packages/config'),
    '@shared': path.resolve(workspaceRoot, 'packages/shared'),
};

// 4. Force Metro to resolve (sub)dependencies only from the nodeModulesPaths
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
