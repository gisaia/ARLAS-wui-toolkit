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
import { LayerSourceConfig } from 'arlas-web-contributors';
import { VisualisationSetConfig } from 'arlas-web-components';

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
        const layerSources = data.arlas.web.contributors.filter(contributor => contributor.type === 'map')[0].layers_sources;
        /** remove layers from visualisation sets if their correponding source is removed from the contributor */
        if (layerSources) {
          const layers = new Set(layerSources.map(ls => ls.id));
          const visualisationsSet: Array<VisualisationSetConfig> = mapComponentConfig.input.visualisations_sets;
          if (visualisationsSet) {
            const updatedVisualisationsSet: Array<VisualisationSetConfig> = [];
            visualisationsSet.forEach(vs => {
              vs.layers = new Set([...vs.layers].filter(l => layers.has(l)));
              if (vs.layers.size > 0) {
                updatedVisualisationsSet.push(vs);
              }
            });
            mapComponentConfig.input.visualisations_sets = updatedVisualisationsSet;
          }
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
    data.arlas.web.contributors.filter(contributor => contributor.type === 'map').forEach(contributor => {
      if (contributor.layers_sources) {
        const updatedLayersSources: Array<LayerSourceConfig> = [];
        contributor.layers_sources.forEach((ls: LayerSourceConfig) => {
          let keepLs = true;
          if (ls.include_fields) {
            ls.include_fields = ls.include_fields.filter(f => availableFields.has(f));
          }
          if (ls.colors_from_fields) {
            ls.colors_from_fields = ls.colors_from_fields.filter(f => availableFields.has(f));
          }
          if (ls.normalization_fields) {
            ls.normalization_fields = ls.normalization_fields.filter(f =>
              availableFields.has(f.on) && (!f.per || availableFields.has(f.per)));
          }
          if (ls.provided_fields) {
            ls.provided_fields = ls.provided_fields.filter(f =>
              availableFields.has(f.color) && (!f.label || availableFields.has(f.label)));
          }
          if (ls.metrics) {
            ls.metrics = ls.metrics.filter(f => f.field === '' || availableFields.has(f.field));
          }
          keepLs = !ls.agg_geo_field || (ls.agg_geo_field && availableFields.has(ls.agg_geo_field));
          if (keepLs) {
            keepLs = !ls.raw_geometry || (ls.raw_geometry && availableFields.has(ls.raw_geometry.geometry));
          }
          if (keepLs && ls.raw_geometry && ls.raw_geometry.sort) {
            ls.raw_geometry.sort = ls.raw_geometry.sort.split(',').filter(s => availableFields.has(s.replace('-', ''))).join(',');
            if (ls.raw_geometry.sort === '') {
              delete ls.raw_geometry.sort;
            }
          }
          if (keepLs) {
            keepLs = !ls.returned_geometry || (ls.returned_geometry && availableFields.has(ls.returned_geometry));
          }
          if (keepLs) {
            keepLs = !ls.geometry_id || (ls.geometry_id && availableFields.has(ls.geometry_id));
          }
          if (keepLs) {
            keepLs = !ls.geometry_support || (ls.geometry_support && availableFields.has(ls.geometry_support));
          }
          if (keepLs) {
            updatedLayersSources.push(ls);
          }
        });
        contributor.layers_sources = updatedLayersSources;
      }
      if (contributor.geo_query_field && !availableFields.has(contributor.geo_query_field)) {
          delete contributor.geo_query_field;
      }
      if (contributor.search_sort) {
        contributor.search_sort = contributor.search_sort.split(',').filter(s => availableFields.has(s.replace('-', ''))).join(',');
        if (contributor.search_sort === '') {
          delete contributor.search_sort;
        }
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
