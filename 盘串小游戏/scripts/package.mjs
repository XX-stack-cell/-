import { packager } from '@electron/packager';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const paths = await packager({
  dir: root,
  out: `${root}/dist`,
  name: '盘物',
  icon: `${root}/assets/icon.icns`,
  appBundleId: 'com.panchuan.companion',
  appCategoryType: 'public.app-category.lifestyle',
  osxSign: process.platform === 'darwin' ? {
    identity: '-',
    identityValidation: false,
    // Local ad-hoc signatures have no Team ID; keep library validation disabled
    // until a real Developer ID signing and notarization flow is configured.
    optionsForFile: () => ({ hardenedRuntime: false }),
    preAutoEntitlements: false,
    preEmbedProvisioningProfile: false
  } : undefined,
  overwrite: true,
  prune: true,
  ignore: [/^\/(tests|scripts|dist|artifacts|\.git)(\/|$)/, /^\/README\.md$/, /\.command$/],
  download: { cacheRoot: '/private/tmp/panchuan-electron-cache', checksums: require('electron/checksums.json') }
});
for (const output of paths) {
  if (process.platform === 'darwin') {
    const bundle = `${output}/盘物.app`;
    // Finder may attach metadata when the newly built bundle appears on Desktop.
    // Only remove that metadata from our generated bundle, preserving all code signatures.
    for (let attempt = 0; attempt < 4; attempt++) {
      spawnSync('xattr', ['-d', 'com.apple.FinderInfo', bundle], { stdio: 'ignore' });
      const verify = spawnSync('codesign', ['--verify', '--deep', '--strict', bundle], { encoding: 'utf8' });
      if (verify.status === 0) break;
      if (attempt === 3 || !verify.stderr.includes('resource fork')) throw new Error(verify.stderr || 'Code signature verification failed');
    }
  }
  console.log(output);
}
