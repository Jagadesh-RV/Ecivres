import { AndroidReleaseConfig } from './android-release.config';
import { DeepLinkingConfig } from './deep-linking.config';

describe('Mobile Store Configuration Verification', () => {
  it('should have valid Android release config', () => {
    expect(AndroidReleaseConfig.applicationId).toBe('com.ecivres.app');
    expect(AndroidReleaseConfig.playIntegrityEnabled).toBe(true);
  });

  it('should have valid deep linking prefixes', () => {
    expect(DeepLinkingConfig.prefixes).toContain('https://ecivres.com');
  });
});
