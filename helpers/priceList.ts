import { premiumPlans } from "./premiumPlans";

export type PriceList = Record<keyof typeof premiumPlans | "none", number>;

export const paidReleaseCost: PriceList = {
  none: 250,
  standard: 190,
  professional: 150,
  enterprise: 0,
};

export const labelCost: PriceList = {
  none: 500,
  standard: 500,
  professional: 500,
  enterprise: 0,
};

export const trackTextCost: PriceList = {
  none: 150,
  standard: 90,
  professional: 70,
  enterprise: 0,
};

export const textSyncCost: PriceList = {
  none: 150,
  standard: 75,
  professional: 50,
  enterprise: 0,
};

export const trackVideoCost: PriceList = {
  none: 150,
  standard: 90,
  professional: 70,
  enterprise: 0,
};

export const videoShotCost: PriceList = {
  none: 150,
  standard: 150,
  professional: 70,
  enterprise: 0,
};
