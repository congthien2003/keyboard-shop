import { z } from "zod";

export const productSpecsSchema = z.object({
  brand: z.string().trim().max(100).nullable().optional(),
  layout: z.string().trim().max(100).nullable().optional(),
  switchType: z.string().trim().max(100).nullable().optional(),
  connectivity: z.array(z.enum(["USB-C", "Bluetooth", "2.4GHz"])).max(3).optional(),
  hotSwappable: z.boolean().nullable().optional(),
});
