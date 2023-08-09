// Types used by Channel Service functions
export type CreateChannelFields = {
  admin: string;
  name: string;
  topic: string;
  password?: string;
};

export type JoinChannelFields = {
  name: string;
  password?: string;
};

export type RejoinChannelFields = {
  channelID: string;
  userID: string;
  name: string;
};
  