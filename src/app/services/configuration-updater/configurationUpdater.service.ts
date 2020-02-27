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

import { Injectable } from '@angular/core';
import { Aggregation } from 'arlas-api';

@Injectable()
export class ArlasConfigurationUpdaterService {

  constructor() {
  }

  /**
   * Parses the configuration and returns a list of contributors that should be removed from the config.
   * @param data configuration object
   * @param availableFields list of fields available for exploration
   * @returns configuration object
   */
  public getContributorsToRemove(data, availableFields: Set<string>): Set<string> {
    const contributorsToRemove = new Set<string>();
    if (data) {
      /** the conf is validated before; therefore, `arlas.web.contributors` is defined */
      data.arlas.web.contributors.forEach(contributor => {
        /** check if aggregation model has a non-available field (in bucket aggregation AND metrics) */
        if (contributor.aggregationmodels) {
          contributor.aggregationmodels.forEach((am: Aggregation) => {
            if (!availableFields.has(am.field)) {
              contributorsToRemove.add(contributor.identifier);
            }
            if (am.metrics) {
              am.metrics.forEach(m => {
                if (!availableFields.has(m.collect_field)) {
                  contributorsToRemove.add(contributor.identifier);
                }
              });
            }
          });
        }
        /** Compute contributors have metrics */
        if (contributor.metrics && contributor.metrics.find(m => !availableFields.has(m.field))) {
            contributorsToRemove.add(contributor.identifier);
        }
        /** swimlanes contributors have a specific structure for `aggregationmodels`  */
        if (contributor.swimlanes) {
          contributor.swimlanes.forEach(swimlane => {
            swimlane.aggregationmodels.forEach((am: Aggregation) => {
              if (!availableFields.has(am.field)) {
                contributorsToRemove.add(contributor.identifier);
              }
              if (am.metrics) {
                am.metrics.forEach(m => {
                  if (!availableFields.has(m.collect_field)) {
                    contributorsToRemove.add(contributor.identifier);
                  }
                });
              }
            });
            /** swimlanes don't have xAxisField AND termField anymore */
          });
        }
        /** topomap contributors has a `topo_aggregationmodels` */
        if (contributor.topo_aggregationmodels) {
          contributor.topo_aggregationmodels.forEach((am: Aggregation) => {
            if (!availableFields.has(am.field)) {
              contributorsToRemove.add(contributor.identifier);
            }
            if (am.metrics) {
              am.metrics.forEach(m => {
                if (!availableFields.has(m.collect_field)) {
                  contributorsToRemove.add(contributor.identifier);
                }
              });
            }
          });
        }
        /** topomap contributors have a `field_cardinality`*/
        if (contributor.field_cardinality && !availableFields.has(contributor.field_cardinality)) {
          contributorsToRemove.add(contributor.identifier);
        }

        /** map and topomap contributors have `geometry` AND `idFieldName` */
        if (contributor.idFieldName && !availableFields.has(contributor.idFieldName)) {
          contributorsToRemove.add(contributor.identifier);
        }

        /** chipssearch contributor */
        if (contributor.search_field && !availableFields.has(contributor.search_field)) {
          contributorsToRemove.add(contributor.identifier);
        }

        /** resultlist contributor */
        if (contributor.fieldsConfiguration && contributor.fieldsConfiguration.idFieldName
          && !availableFields.has(contributor.fieldsConfiguration.idFieldName)) {
            contributorsToRemove.add(contributor.identifier);
        }
      });
      /** remove detailed contributors */
      data.arlas.web.contributors.filter(contributor => contributor.annexedContributorId).forEach(contributor => {
        if (contributorsToRemove.has(contributor.annexedContributorId)) {
          contributorsToRemove.add(contributor.identifier);
        }
      });

    }
    return contributorsToRemove;
  }

  /**
   * Removes contributors that have non-available fields
   * @param data configuration objects
   * @param contributorsToRemove list of contributors identifiers to remove from the configuration
   * @returns configuration object
   */
  public removeContributors(data, contributorsToRemove: Set<string>): any {
    if (data) {
      data.arlas.web.contributors = data.arlas.web.contributors.filter(contributor =>
        !contributorsToRemove.has(contributor.identifier));
    }
    return data;
  }

  /**
   * Removes widgets that are associated with removed contributors
   * @param data
   * @param contributorsToRemove
   * @returns configuration object
   */
  public removeWidgets(data, contributorsToRemove: Set<string>): any {
    if (data) {
      data.arlas.web.analytics.forEach(widget => {
        widget.components = widget.components.filter(c => !contributorsToRemove.has(c.contributorId));
      });
      data.arlas.web.analytics = data.arlas.web.analytics.filter(widget => widget.components.length > 0);
    }
    return data;
  }

  /**
   * Removes timelines that are associated with removed timeline contributors
   * @param data
   * @param contributorsToRemove
   * @returns configuration object
   */
  public removeTimelines(data, contributorsToRemove: Set<string>): any {
    if (data) {
      const components = data.arlas.web.components;
      if (components) {
        if (components.timeline) {
          if (contributorsToRemove.has(components.timeline.contributorId)) {
            delete components.timeline;
          }
        }
        if (components.detailedTimeline) {
          if (contributorsToRemove.has(components.detailedTimeline.contributorId)) {
            delete components.detailedTimeline;
          }
        }
      }

    }
    return data;
  }

  /**
   * Removes the properties -from all contributors- including fields that are not available for exploration
   * @param data configuration object
   * @param availableFields List of available fields for exploration
   * @returns configuration object
   */
  public updateContributors(data, availableFields: Set<string>): any {
      let updatedConfig = this.updateResultListContributor(data, availableFields);
      updatedConfig = this.updateMapContributors(updatedConfig, availableFields);
      updatedConfig = this.updateChipSearchContributors(updatedConfig, availableFields);
      return updatedConfig;
  }

  /**
   * Removes the properties -from map component - including fields that are not available for exploration
   * @param data configuration object
   * @param availableFields List of available fields for exploration
   * @returns configuration object
   */
  public updateMapComponent(data, availableFields: Set<string>): any {
    if (data && data.arlas.web.components) {
      const mapComponentConfig = data.arlas.web.components.mapgl;
      if (mapComponentConfig && mapComponentConfig.input) {
        const idFeatureField = mapComponentConfig.input.idFieldName;
        if (idFeatureField && !availableFields.has(idFeatureField)) {
          delete mapComponentConfig.input.idFieldName;
        }
      }
    }
    return data;
  }

  /**
   * Removes the properties -from ResultListContributor- that define fields not available for exploration
   * @param data configuration object
   * @param availableFields List of available fields for exploration
   * @returns configuration object
   */
  public updateResultListContributor(data, availableFields: Set<string>): any {
    data.arlas.web.contributors.filter(contributor => contributor.type === 'resultlist').forEach(contributor => {
      if (contributor.fieldsConfiguration) {
        const fc = contributor.fieldsConfiguration;
        /** remove imageFieldName */
        if (fc.imageFieldName && !availableFields.has(fc.imageFieldName)) {
          delete fc.imageFieldName;
          delete fc.urlImageTemplate;
        }
        /** remove thumbnailFieldName */
        if (fc.thumbnailFieldName && !availableFields.has(fc.thumbnailFieldName)) {
          delete fc.thumbnailFieldName;
          delete fc.urlThumbnailTemplate;
        }
        /** remove urlImageTemplate */
        if (fc.urlImageTemplate) {
          const url = fc.urlImageTemplate;
          const eventualField = url.substring(
            url.lastIndexOf('{') + 1,
            url.lastIndexOf('}')
          );
          if (eventualField && eventualField.length > 0 && !availableFields.has(eventualField)) {
            delete fc.imageEnabled;
            delete fc.urlImageTemplate;
          }
        }
        /** remove urlThumbnailTemplate */
        if (fc.urlThumbnailTemplate) {
          const url = fc.urlThumbnailTemplate;
          const eventualField = url.substring(
            url.lastIndexOf('{') + 1,
            url.lastIndexOf('}')
          );
          if (eventualField && eventualField.length > 0 && !availableFields.has(eventualField)) {
            delete fc.thumbnailEnabled;
            delete fc.urlThumbnailTemplate;
          }
        }
        /** remove titleFieldNames.fieldPath */
        if (fc.titleFieldNames) {
          fc.titleFieldNames = fc.titleFieldNames.filter(t => availableFields.has(t.fieldPath));
        }
        /** remove tooltipFieldNames.fieldPath */
        if (fc.tooltipFieldNames) {
          fc.tooltipFieldNames = fc.tooltipFieldNames.filter(t => availableFields.has(t.fieldPath));
        }
        /** remove iconCssClass */
        if (fc.iconCssClass && !availableFields.has(fc.iconCssClass)) {
          delete fc.iconCssClass;
        }
        /** remove iconColorFieldName */
        if (fc.iconColorFieldName && !availableFields.has(fc.iconColorFieldName)) {
          delete fc.iconColorFieldName;
        }
      }
      /** remove columns */
      if (contributor.columns) {
        contributor.columns = contributor.columns.filter(c => availableFields.has(c.fieldName));
      }
      /** remove details */
      if (contributor.details) {
        contributor.details.forEach(detail => {
          if (detail.fields) {
            detail.fields = detail.fields.filter(field => availableFields.has(field.path));
          }
        });
        contributor.details = contributor.details.filter(detail => (detail.fields && detail.fields.length > 0));
      }
      /** remove attachments */
      if (contributor.attachments) {
        contributor.attachments = contributor.attachments.filter(a => availableFields.has(a.attachmentsField) &&
          availableFields.has(a.attachementUrlField));
      }
      /** remove metadata fields */
      if (contributor.includeMetadata)  {
        contributor.includeMetadata = contributor.includeMetadata.filter(f => availableFields.has(f));
      }
    });
    return data;
  }

  /**
   * Removes the properties -from MapConributor- that define fields not available for exploration
   * @param data configuration object
   * @param availableFields List of available fields for exploration
   * @returns configuration object
   */
  public updateMapContributors(data, availableFields: Set<string>): any {
    data.arlas.web.contributors.filter(contributor => contributor.type === 'map' || contributor.type === 'topomap').forEach(contributor => {
      if (contributor.includeFeaturesFields) {
        contributor.includeFeaturesFields = contributor.includeFeaturesFields.filter(f => availableFields.has(f));
      }
      if (contributor.colorGenerationFields) {
        contributor.colorGenerationFields = contributor.colorGenerationFields.filter(f => availableFields.has(f));
      }
      if (contributor.normalizationFields) {
        contributor.normalizationFields = contributor.normalizationFields
          .filter(f => availableFields.has(f.on) && (!f.per || availableFields.has(f.per)));
      }
      if (contributor.geoQueryField && !availableFields.has(contributor.geoQueryField)) {
          delete contributor.geoQueryField;
      }
      if (contributor.searchSort && !availableFields.has(contributor.searchSort)) {
          delete contributor.searchSort;
      }
    });
    return data;
  }

  /**
   * Removes the properties -from ChipsearchContributor- that define fields not available for exploration
   * @param data configuration object
   * @param availableFields List of available fields for exploration
   * @returns configuration object
   */
  public updateChipSearchContributors(data, availableFields: Set<string>): any {
    data.arlas.web.contributors.filter(contributor => contributor.type === 'chipssearch').forEach(contributor => {
      if (contributor.autocomplete_field && !availableFields.has(contributor.autocomplete_field)) {
          delete contributor.autocomplete_field;
      }
    });
    return data;
  }
}
