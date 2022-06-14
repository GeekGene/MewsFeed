import {
  AppWebsocket,
  CallZomeRequest,
  InstalledAppInfo,
  InstalledCell,
} from "@holochain/client";
import { inject, InjectionKey } from "vue";
import { CreateMewInput, FeedOptions, FeedMew, Mew } from "../types/types";
import { AgentPubKeyB64, HeaderHashB64 } from "@holochain-open-dev/core-types";

let appWebSocket: AppWebsocket;
let appInfo: InstalledAppInfo;

export const installed_app_id = "clutter";

export let clutterCell: InstalledCell;

export const APP_WEB_SOCKET: InjectionKey<AppWebsocket> = Symbol();
export const connectAppWebSocket = async () => {
  if (!appWebSocket) {
    appWebSocket = await AppWebsocket.connect(
      `ws://localhost:${import.meta.env.VITE_HC_PORT}`
    );
    appInfo = await appWebSocket.appInfo({ installed_app_id });
    const cell = appInfo.cell_data.find((cell) => cell.role_id === "clutter");
    if (!cell) {
      throw new Error('Could not find cell "clutter"');
    }
    clutterCell = cell;
  }
  return appWebSocket;
};

export const useAppWebSocket = () => {
  const injected = inject(APP_WEB_SOCKET);
  if (!injected) {
    throw new Error("App WebSocket has not been initialized");
  }
  return injected;
};

const callZome = async (
  req: Pick<CallZomeRequest, "zome_name" | "fn_name" | "payload">
) => {
  const provenance = clutterCell.cell_id[1];
  return appWebSocket.callZome({
    cell_id: clutterCell.cell_id,
    zome_name: req.zome_name,
    fn_name: req.fn_name,
    payload: req.payload,
    cap_secret: null,
    provenance,
  });
};

export enum MewsFn {
  CreateMew = "create_mew",
  GetMew = "get_mew",
  MewsFeed = "mews_feed",
  MewsBy = "mews_by",
  Follow = "follow",
  Followers = "followers",
  Following = "following",
  MyFollowers = "my_followers",
  MyFollowing = "my_following",
  Unfollow = "unfollow",
  LickMew = "lick_mew",
  UnlickMew = "unlick_mew",
  MyLicks = "my_licks",
  GetFeedMewAndContext = "get_feed_mew_and_context",
  GetMewsWithCashtag = "get_mews_with_cashtag",
  GetMewsWithHashtag = "get_mews_with_hashtag",
  GetMewsWithMention = "get_mews_with_mention",
}

export const createMew = async (mew: CreateMewInput) => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.CreateMew,
    payload: mew,
  });
};

export const getMew = async (mew: HeaderHashB64): Promise<Mew> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.GetMew,
    payload: mew,
  });
};

export const mewsFeed = async (
  options: FeedOptions
): Promise<Array<FeedMew>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.MewsFeed,
    payload: options,
  });
};

export const mewsBy = async (
  agent: AgentPubKeyB64
): Promise<Array<FeedMew>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.MewsBy,
    payload: agent,
  });
};

export const follow = async (agent: AgentPubKeyB64): Promise<null> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.Follow,
    payload: agent,
  });
};

export const unfollow = async (agent: AgentPubKeyB64): Promise<null> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.Unfollow,
    payload: agent,
  });
};

export const followers = async (
  agent: AgentPubKeyB64
): Promise<Array<AgentPubKeyB64>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.Followers,
    payload: agent,
  });
};

export const following = async (
  agent: AgentPubKeyB64
): Promise<Array<AgentPubKeyB64>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.Following,
    payload: agent,
  });
};

export const myFollowers = async (): Promise<Array<AgentPubKeyB64>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.MyFollowers,
    payload: null,
  });
};

export const myFollowing = async (): Promise<Array<AgentPubKeyB64>> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.MyFollowing,
    payload: null,
  });
};

export const lickMew = async (mew: HeaderHashB64): Promise<null> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.LickMew,
    payload: mew,
  });
};

export const unlickMew = async (mew: HeaderHashB64): Promise<null> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.UnlickMew,
    payload: mew,
  });
};

export const getFeedMewAndContext = async (mew: string): Promise<FeedMew> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.GetFeedMewAndContext,
    payload: mew,
  });
};

export const getMewsWithCashtag = async (
  cashtag: string
): Promise<FeedMew[]> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.GetMewsWithCashtag,
    payload: cashtag,
  });
};

export const getMewsWithHashtag = async (
  hashtag: string
): Promise<FeedMew[]> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.GetMewsWithHashtag,
    payload: hashtag,
  });
};

export const getMewsWithMention = async (
  mention: string
): Promise<FeedMew[]> => {
  return callZome({
    zome_name: "mews",
    fn_name: MewsFn.GetMewsWithMention,
    payload: mention,
  });
};
