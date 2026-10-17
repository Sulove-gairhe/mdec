/* Modern Digital Electronics | Dashain–Tihar 2083
 * Supplied social QR images are preserved as local PNG assets for offline use.
 * Prize selection is equally likely among five options (demo only, browser-side).
 */
window.FESTIVAL_CONFIG = {
  brand: 'Modern Digital Electronics',
  spinDurationMs: 9000,
  spinRounds: 10,
  qr: [
    { id: 'google', label: 'Google Reviews', english: 'GOOGLE REVIEWS', image: 'assets/qr-google-review.png', caption: 'SCAN TO LEAVE A REVIEW' },
    { id: 'tiktok', label: 'TikTok', english: 'TIKTOK', image: 'assets/tiktok-qr.png', caption: '@modern.digital.el' },
    { id: 'facebook', label: 'Facebook', english: 'FACEBOOK', image: 'assets/qr-facebook.png', caption: 'SCAN TO FOLLOW' }
  ],
  prizes: [
    { id: 'red-jug', english: 'RED ELECTRIC JUG', image: 'assets/red-kettle.png' },
    { id: 'white-jug', english: 'WHITE ELECTRIC JUG', image: 'assets/silver-kettle.png' },
    { id: 'multiplug', english: 'MULTIPLUG', image: 'assets/multiplug.svg' },
    { id: 'cashback', english: 'RS. 500 CASHBACK', image: 'assets/cashback.svg' },
    { id: 'iron', english: 'ELECTRIC IRON', image: 'assets/iron.png' }
  ]
};
