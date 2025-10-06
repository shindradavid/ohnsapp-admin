export type AuthStackParamList = {
  Login: undefined;
};

export type RootStackParamList = {
  Main: undefined;
};

export interface ApiResponse<T> {
  success: boolean;
  payload: T;
  message?: string;
}

export interface MutationArgs {
  onError: (message: string | null | undefined) => void;
  onSuccess: (message: string | null | undefined) => void;
}

export interface ImageFile {
  uri: string;
  fileName: string;
  mimeType: string;
}
