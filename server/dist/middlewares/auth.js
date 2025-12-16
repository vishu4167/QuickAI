import { clerkClient } from "@clerk/express";
export const auth = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        const hasPremiumPlan = await has({ plan: "premium" });
        const user = await clerkClient.users.getUser(userId);
        const privateMetadata = user.privateMetadata;
        if (!hasPremiumPlan && privateMetadata.free_usage !== undefined) {
            req.free_usage = privateMetadata.free_usage;
        }
        else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 },
            });
            req.free_usage = 0;
        }
        req.plan = hasPremiumPlan ? "premium" : "free";
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.json({ success: false, message: errorMessage });
    }
};
