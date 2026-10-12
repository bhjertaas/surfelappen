import QRCode from 'qrcode';

/** The SVG for a URL's QR code, the same every time (shared by make-qr and its content test). */
export async function qrSvg(url: string): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#1d1d1f', light: '#ffffff' },
  });
  // A title for linting; the page shows the code with alt="" and explains it in text.
  return svg.replace(/^<svg([^>]*)>/, '<svg$1><title>QR</title>');
}
