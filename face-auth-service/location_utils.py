from math import atan2, cos, radians, sin, sqrt

from fastapi import HTTPException


EARTH_RADIUS_METERS = 6_371_000.0


def calculate_distance_meters(
    latitude_one: float,
    longitude_one: float,
    latitude_two: float,
    longitude_two: float,
) -> float:
    latitude_one_radians = radians(latitude_one)
    longitude_one_radians = radians(longitude_one)
    latitude_two_radians = radians(latitude_two)
    longitude_two_radians = radians(longitude_two)

    latitude_delta = latitude_two_radians - latitude_one_radians
    longitude_delta = longitude_two_radians - longitude_one_radians

    haversine_value = (
        sin(latitude_delta / 2) ** 2
        + cos(latitude_one_radians)
        * cos(latitude_two_radians)
        * sin(longitude_delta / 2) ** 2
    )
    haversine_value = max(0.0, min(1.0, haversine_value))
    angular_distance = 2 * atan2(
        sqrt(haversine_value),
        sqrt(1 - haversine_value),
    )

    return EARTH_RADIUS_METERS * angular_distance


def verify_student_is_within_session_radius(
    *,
    student_latitude: float,
    student_longitude: float,
    session_latitude: float | None,
    session_longitude: float | None,
    allowed_radius_meters: int | None,
) -> float:
    if (
        session_latitude is None
        or session_longitude is None
        or allowed_radius_meters is None
    ):
        raise HTTPException(
            status_code=409,
            detail="session location is not configured",
        )

    distance_meters = calculate_distance_meters(
        session_latitude,
        session_longitude,
        student_latitude,
        student_longitude,
    )

    if distance_meters > allowed_radius_meters:
        raise HTTPException(
            status_code=403,
            detail="student is outside the allowed attendance area",
        )

    return distance_meters
