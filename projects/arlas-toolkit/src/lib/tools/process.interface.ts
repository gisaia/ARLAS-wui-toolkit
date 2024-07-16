import { BBox } from 'geojson';

export interface ProcessInputs {
  [key: string]: ProcessInput;
}

export interface ProcessProjection {
  label: string;
  value: string;
  bbox: BBox;
}


export interface ProcessInput {
  schema: {
    type: string;
    enum?: string[] | ProcessProjection[];
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
