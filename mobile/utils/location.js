import * as Location from 'expo-location';

export async function getCurrentAttendanceLocation() {
  const locationServicesEnabled = await Location.hasServicesEnabledAsync();

  if (!locationServicesEnabled) {
    throw new Error('Turn on location services to check in.');
  }

  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Location permission is required to check in.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    mayShowUserSettingsDialog: true,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
  };
}
