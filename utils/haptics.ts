import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export function triggerKeepHaptic() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function triggerTrashHaptic() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
