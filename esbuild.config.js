import * as esbuild from 'esbuild';

const buildConfig = {
  // Configurações comuns para ambos os builds
  common: {
    entryPoints: ['src/navito.ts'],
    bundle: true,
    minify: true,
  },
  // Configuração para o formato ESM (módulo)
  module: {
    outfile: 'dist/navito.module.min.js',
    format: 'esm',
  },
  // Configuração para o formato IIFE (global)
  global: {
    outfile: 'dist/navito.global.min.js',
    format: 'iife',
    globalName: 'Navito',
    // Garante que a exportação padrão seja atribuída diretamente ao `window.Navito`
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