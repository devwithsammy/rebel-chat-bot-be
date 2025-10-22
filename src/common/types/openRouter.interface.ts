export interface IOpenRouterResponse {
  id?: string;
  provider?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}
