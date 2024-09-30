import { premiumPlans } from "./premiumPlans";

export type PriceList = Record<keyof typeof premiumPlans, number>;

export const paidReleaseCost: PriceList = {
  standard: 190,
  professional: 150,
  enterprise: 0,
};

export const labelCost: PriceList = {
  standard: 500,
  professional: 500,
  enterprise: 0,
};

export const trackTextCost: PriceList = {
  standard: 90,
  professional: 70,
  enterprise: 0,
};

export const textSyncCost: PriceList = {
  standard: 75,
  professional: 50,
  enterprise: 0,
};

export const trackVideoCost: PriceList = {
  standard: 90,
  professional: 70,
  enterprise: 0,
};

export const videoShotCost: PriceList = {
  standard: 150,
  professional: 70,
  enterprise: 0,
};
