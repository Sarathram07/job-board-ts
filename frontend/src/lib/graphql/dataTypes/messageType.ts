export interface Message {
  __typename?: string;
  id: string;
  user: string;
  text: string;
}

export type GetAllMsgResponse = {
  messages: Message[];
};

export type GetMsgResponse = {
  message: Message[];
};
