/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { BBox } from 'geojson';

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
  processID: 'download' | 'ingest' | 'directory_ingest' | 'enrich' | 'dc3build';
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
