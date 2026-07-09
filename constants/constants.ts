import { Dimensions } from "react-native";

const { width , height } = Dimensions.get("window");

// Part 1 constsants
export const TABBAR_WIDTH = width * 0.75;
export const SPACING = 20;

export const TAB_ITEM_SIZE = 60;

export const TEXT_COLOR = "#464343ff";
export const BG_COLOR = "#edf2f5";     //ff701f      c2c2c2    edf2f5
export const GREEN = "#29b571";  //bdf14d
  
// Part 2 constants

export const BACKGROUND_TRANSLATE_Y = -2;
export const BADGE_HEIGHT = 44;
export const BADGE_WIDTH = 120;
export const INACTIVE_ROTATION = "8deg";


export const CARD_WIDTH = width - 20;
export const CARD_HEIGHT = height * 0.72;


// export const CARD_WIDTH = width - SPACING * 4;
// export const CARD_HEIGHT = CARD_WIDTH * 1.2;

export const SPRING_CONFIG = { damping: 60, stiffness: 1000 };

export const SWIPE_THRESHOLD = 100;
export const SWIPE_VELOCITY_THRESHOLD = 800;

export const MAX_VISIBLE_STACK = 4;
export const PREFETCH_AHEAD_COUNT = 3;
