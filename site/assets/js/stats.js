// Cloudflare Web Analytics (cookieless, no personal data). Only on the public copy, sdo.martigor.org;
// the private copy (iris.) never loads it. The token is public by design (it ships in every page that uses the beacon).
(function () {
  if (location.hostname !== 'sdo.martigor.org') return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token":"ec1886d5bbd04cf69e6b0555aa73a05c"}');
  document.head.appendChild(s);
})();
