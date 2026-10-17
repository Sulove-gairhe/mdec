# Modern Digital Electronics — TV Spin & Win (QR v2)

Fully offline two-screen 16:9 website for **दशैं तिहार २०८३**. The welcome page uses the **three QR images supplied by the shop** at three outer corners: Google Reviews (top left), TikTok (top right), Facebook (bottom left). Instagram has been completely removed. The blue/gold campaign badge is larger, social network names are in English, and **उपहार खोल्नुहोस्** routes directly to the automatic spin.

## Start

Open `index.html` in Chrome or Edge; press **F11** for fullscreen on the TV. No hosting, internet, framework, or setup is needed to display the site. Internet access is necessary when visitors scan the QR codes to open social pages. The spinning/winner reveal functions offline.

## Actual QR code images

- `assets/qr-google-review.png` — exact supplied Google Maps Reviews QR.
- `assets/qr-tiktok-original.png` — exact full image supplied, including account handle.
- `assets/qr-tiktok-scan.png` — **QR-only crop** of the supplied TikTok image for larger screen readability. The black/cyan/red code dots are unchanged.
- `assets/qr-facebook.png` — exact supplied Facebook QR.

**Test scanning each code with a phone from actual customer viewing distance before live use.** Scan behavior depends on image quality, phone camera and display reflections. The files preserve the supplied QR images; their target URLs have not been independently verified.

## Experience

1. Welcome screen: big blue campaign logo, three real QR codes, English social labels.
2. Click **उपहार खोल्नुहोस्** (or press Enter): navigation to the wheel screen, which automatically starts a spin.
3. Wheel stops on one of five visual prizes: red jug, white jug, multiplug, Rs. 500 cashback, electric iron. Looping confetti starts after winner reveal.
4. Reset using the **अर्को ग्राहकका लागि सुरु गर्नुहोस्** button, Esc or N.

## Production warning

The prize wheel still runs entirely in the user's browser: equal random probability, **no server-side recording, stock limits, one-spin-per-person guarantee or redemption proof**. For real customer rewards and cashback, integrate server-issued one-use coupons and staff redemption tracking before deployment.

## Customize

Edit `config.js` for prizes and QR image paths; `styles.css` for display proportions. Opening `index.html` uses the included PNG and SVG assets locally. The prize drawings are illustrations, not photographic SKU matches.
