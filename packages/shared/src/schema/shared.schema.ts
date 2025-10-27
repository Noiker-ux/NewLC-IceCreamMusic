import { z } from "zod";

export const fileSchema = z.instanceof(File);

export const stringAsDateSchema = z.coerce.date()
