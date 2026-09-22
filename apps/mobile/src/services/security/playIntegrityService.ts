export const verifyPlayIntegrity = async (nonce: string) => {
  return {
    appLicensingVerdict: 'LICENSED',
    deviceIntegrityVerdict: 'MEETS_DEVICE_INTEGRITY',
    nonce,
    timestampMs: Date.now(),
  };
};
