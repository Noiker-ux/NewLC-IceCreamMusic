import { premiumPlans } from 'shared/helpers/premiumPlans';
import z from 'zod';

export const purchaseTypeSchema = z.enum(['subscription', 'release']);

export const paramsSchema = z.tuple([purchaseTypeSchema, z.string()]);

export const subscriptionLevels = Object.keys(premiumPlans);

export type TPremiumPlans = keyof typeof premiumPlans;