export function buildDeepLink(referralCode: string, campaign: string = 'app_share'): string {
  return `https://ecivres.com/r/${referralCode}?utm_source=${campaign}`;
}

export function buildQrImageUrl(deepLink: string, size: number = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(deepLink)}`;
}
