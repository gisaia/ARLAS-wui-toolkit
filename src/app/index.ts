import { ArlasDataSource } from './tools/arlasDataSource';
import { from } from 'rxjs';
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

export {
  ArlasExploreApi,
  ArlasStartupService,
  ArlasCollaborativesearchService,
  ArlasConfigService
} from './services/startup/startup.service';
export { ArlasBookmarkService } from './services/bookmark/bookmark.service';
export { ArlasAoiService } from './services/aoi/aoi.service';
export { ArlasMapService } from './services/map/map.service';
export { ArlasColorGeneratorLoader } from './services/color-generator-loader/color-generator-loader.service';
export { ArlasMapSettings } from './services/map-settings/map-settings.service';
export { ArlasToolKitModule } from './app.module';
export { ArlasDataSource } from './tools/arlasDataSource';
export { ArlasTaggerModule } from './tagger.module';
