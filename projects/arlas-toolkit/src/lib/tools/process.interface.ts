export interface Process {
  id?: string;
  version?: string;
  title?: string;
  description?: string;
  inputs?: ProcessInputs;
  additionalParameters?: {
    parameters: any[];
  };
}

export interface ProcessInputs {
  [key: string]: ProcessInput;
}

export interface ProcessInput {
  title: string;
  description: string;
  schema: {
    type: string;
    enum?: string[];
    format?: string;
    items?: {
      type: string;
      enum?: string[];
    };
    required?: boolean;
  };
}
