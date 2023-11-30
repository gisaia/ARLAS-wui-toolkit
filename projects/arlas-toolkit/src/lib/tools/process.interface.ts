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

export interface ProcessOutput {
  processID: 'download' | 'ingest' | 'directory_ingest';
  type: string;
  jobID: string;
  status: ProcessStatus;
  message: string;
  created: number;
  started: number;
  finished: number;
  updated: number;
  progress: number;
  links: any;
  resourceID: string;
}

export enum ProcessStatus {
  accepted = 'accepted',
  running = 'running',
  successful = 'successful',
  failed = 'failed',
  dismissed = 'dismissed'
}
