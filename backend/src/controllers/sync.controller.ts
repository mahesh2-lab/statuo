import { Request, Response } from "express";
import { schedulerService } from "../services/scheduler.service";
import { ApiResponse, asyncHandler } from "../utils/api-response";

export const syncJobsHandler = asyncHandler(async (req: Request, res: Response) => {
  // Broadcast instant sync event via Redis Pub/Sub
  await schedulerService.notifyJobChange("sync");
  await schedulerService.syncJobs("push");

  return ApiResponse.ok(
    res,
    { timestamp: new Date().toISOString() },
    "Distributed scheduler sync triggered successfully"
  );
});
