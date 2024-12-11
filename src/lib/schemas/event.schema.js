import { z } from "zod";

export const schemaEvent = z.object({
    eventName: z.string(),
    description: z.string(),
    groupId: z.string(),
    startDate: z.any(),
    eventType: z.enum(["OFFLINE", "ONLINE"]),
    eventPicture: z.string().optional(),
    socialType: z.enum(["MIF_LIVE", "OTHER"]),
    link: z.string().optional(),
    location: z.string().optional(),
});