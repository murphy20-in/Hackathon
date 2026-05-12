"""
Google Encoded Polyline decoder.
Decodes polyline strings into lists of (latitude, longitude) tuples.
"""


def decode_polyline(encoded: str, precision: int = 5) -> list[tuple[float, float]]:
    """
    Decode a Google-encoded polyline string into a list of (lat, lng) tuples.

    Args:
        encoded: The encoded polyline string
        precision: Decimal precision (5 for Google, 6 for OSRM)

    Returns:
        List of (latitude, longitude) tuples
    """
    coordinates = []
    index = 0
    lat = 0
    lng = 0
    factor = 10 ** precision

    while index < len(encoded):
        # Decode latitude
        shift = 0
        result = 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        lat += (~(result >> 1) if (result & 1) else (result >> 1))

        # Decode longitude
        shift = 0
        result = 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        lng += (~(result >> 1) if (result & 1) else (result >> 1))

        coordinates.append((lat / factor, lng / factor))

    return coordinates
