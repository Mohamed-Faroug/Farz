import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@swipeclean/onboarding-complete";

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === "true";
}

export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}
