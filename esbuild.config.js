import * as esbuild from 'esbuild';

const buildConfig = {
  common: {
    entryPoints: ['src/navito.ts'],
    bundle: true,
    minify: true,
  },
  module: {
    outfile: 'dist/navito.module.min.js',
    format: 'esm',
  },
  global: {
    outfile: 'dist/navito.global.min.js',
    format: 'iife',
    globalName: 'Navito',
    footer: { 
      js: 'window.Navito = Navito.default;' 
    },
  },
};

try {
    // Execute builds
    await esbuild.build({
        ...buildConfig.common,
        ...buildConfig.module,
    });

    await esbuild.build({
        ...buildConfig.common,
        ...buildConfig.global,
    });

    console.log('✅ Build success!');
} catch (error) {
    console.error('❌ Build error:', error);
    process.exit(1);
}