import SplashScreen from "@/components/SplashScreen";
import { isOnboardingComplete } from "@/storage/onboardingStorage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    isOnboardingComplete().then((done) => {
      setOnboardingDone(done);
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
