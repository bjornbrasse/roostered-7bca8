/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as assignment from "../assignment.js";
import type * as department from "../department.js";
import type * as organisation from "../organisation.js";
import type * as schedule from "../schedule.js";
import type * as session from "../session.js";
import type * as specialDate from "../specialDate.js";
import type * as task from "../task.js";
import type * as team from "../team.js";
import type * as user from "../user.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assignment: typeof assignment;
  department: typeof department;
  organisation: typeof organisation;
  schedule: typeof schedule;
  session: typeof session;
  specialDate: typeof specialDate;
  task: typeof task;
  team: typeof team;
  user: typeof user;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
