/**
 * Decode a Google Encoded Polyline string into an array of {latitude, longitude} objects.
 * Compatible with react-native-maps coordinate format.
 *
 * @param {string} encoded - The encoded polyline string
 * @param {number} precision - Decimal precision (5 for Google, 6 for OSRM)
 * @returns {Array<{latitude: number, longitude: number}>}
 */
export function decodePolyline(encoded, precision = 5) {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const factor = Math.pow(10, precision);

  while (index < encoded.length) {
    // Decode latitude
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    // Decode longitude
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push({
      latitude: lat / factor,
      longitude: lng / factor,
    });
  }

  return coordinates;
}
