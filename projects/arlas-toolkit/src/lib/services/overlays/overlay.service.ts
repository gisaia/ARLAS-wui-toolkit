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

import { OriginConnectionPosition, Overlay, OverlayConfig, OverlayConnectionPosition, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { ARLASDonutTooltip, TimelineTooltip } from 'arlas-d3';
import { HistogramTooltip } from 'arlas-web-components';
import {
  CalendarTimelineTooltipOverlayComponent
} from '../../components/calendar-timeline-tooltip-overlay/calendar-timeline-tooltip-overlay.component';
import { DonutTooltipOverlayComponent } from '../../components/donut-tooltip-overlay/donut-tooltip-overlay.component';
import { HistogramTooltipOverlayComponent } from '../../components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import {
  ARLASPowerbarTooltip, PowerbarTooltipOverlayComponent
} from '../../components/powerbar-tooltip-overlay/powerbar-tooltip-overlay.component';
import {
  ArlasOverlayRef, CALENDAR_TIMELINE_TOOLTIP_DATA, DONUT_TOOLTIP_DATA, HISTOGRAM_TOOLTIP_DATA, HistogramTooltipExtended, POWERBAR_TOOLTIP_DATA
} from '../../tools/utils';


export interface ToolTipConfig<T> {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: T;
}

const DEFAULT_TOOLTIP_CONFIG: ToolTipConfig<any> = {
  hasBackdrop: false,
  panelClass: 'tm-file-preview-dialog-panel'
};

@Injectable()
export class ArlasOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  public openHistogramTooltip(config: ToolTipConfig<HistogramTooltip>, elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    return this.openChartTooltip(config, 'histogram', elementRef, xOffset, yOffset, right);
  }

  public openCalendarTimelineTooltip(config: ToolTipConfig<TimelineTooltip>, elementRef: ElementRef, xOffset: number,
    yOffset: number, right: boolean) {
    return this.openTooltip(config, elementRef, xOffset, yOffset, right, CalendarTimelineTooltipOverlayComponent, CALENDAR_TIMELINE_TOOLTIP_DATA);
  }

  public openDonutTooltip(config: ToolTipConfig<ARLASDonutTooltip>, elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    return this.openTooltip(config, elementRef, xOffset, yOffset, right, DonutTooltipOverlayComponent, DONUT_TOOLTIP_DATA);
  }

  public openPowerbarTooltip(config: ToolTipConfig<ARLASPowerbarTooltip>, elementRef: ElementRef, xOffset: number,
    yOffset: number, right: boolean) {
    return this.openTooltip(config, elementRef, xOffset, yOffset, right, PowerbarTooltipOverlayComponent, POWERBAR_TOOLTIP_DATA);
  }

  public openSwimlaneTooltip(config: ToolTipConfig<HistogramTooltip>, elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    return this.openChartTooltip(config, 'swimlane', elementRef, xOffset, yOffset, right);
  }

  /**
   * For a Histogram or Swimlane chart, opens the tooltip
   */
  private openChartTooltip(config: ToolTipConfig<HistogramTooltip>, chartType: 'histogram' | 'swimlane',
    elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {

    const specificConfig: ToolTipConfig<HistogramTooltipExtended> = {
      ...config,
      data: {
        ...config.data,
        chartType
      }
    };
    return this.openTooltip(specificConfig, elementRef, xOffset, yOffset, right, HistogramTooltipOverlayComponent, HISTOGRAM_TOOLTIP_DATA);
  }

  private openTooltip<T, U>(config: ToolTipConfig<T>, elementRef: ElementRef, xOffset: number,
    yOffset: number, right: boolean, componentType: ComponentType<U>, token: InjectionToken<T>) {
    const dialogConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...config };

    const overlayRef = this.createTooltipOverlay(dialogConfig, elementRef, xOffset, yOffset, right);
    // Returns an OverlayRef which is a PortalHost
    const componentActionsRef = new ArlasOverlayRef(overlayRef);
    this.attachTooltipContainer(overlayRef, dialogConfig, componentActionsRef, componentType, token);

    return componentActionsRef;
  }

  private createTooltipOverlay<T>(config: ToolTipConfig<T>, elementRef: ElementRef, xOffset: number, yOffset: number,
    right: boolean) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config, elementRef, xOffset, yOffset, right, /** bottom */ false);
    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private createTooltipInjector<T>(config: ToolTipConfig<T>, ref: ArlasOverlayRef, token: InjectionToken<any>): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ArlasOverlayRef, useValue: ref },
        { provide: token, useValue: config.data }
      ]
    });
  }

  private attachTooltipContainer<T, U>(overlayRef: OverlayRef, config: ToolTipConfig<T>, arlasOverlayRef: ArlasOverlayRef,
    componentType: ComponentType<U>, token: InjectionToken<any>) {
    const injector = this.createTooltipInjector(config, arlasOverlayRef, token);
    const containerPortal = new ComponentPortal(componentType, null, injector);
    const containerRef: ComponentRef<U> = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private getOverlayConfig(config: any, elementRef: ElementRef, xOffset: number, yOffset: number,
    right: boolean, bottom: boolean): OverlayConfig {
    const origins = {
      topLeft: { originX: 'start', originY: 'top' } as OriginConnectionPosition,
      topRight: { originX: 'end', originY: 'top' } as OriginConnectionPosition,
      bottomLeft: {
        originX: 'start',
        originY: 'bottom'
      } as OriginConnectionPosition,
      bottomRight: {
        originX: 'end',
        originY: 'bottom'
      } as OriginConnectionPosition,
      topCenter: {
        originX: 'center',
        originY: 'top'
      } as OriginConnectionPosition,
      bottomCenter: {
        originX: 'center',
        originY: 'bottom'
      } as OriginConnectionPosition
    };
    const overlays = {
      topLeft: {
        overlayX: 'start',
        overlayY: 'top'
      } as OverlayConnectionPosition,
      topRight: {
        overlayX: 'end',
        overlayY: 'top'
      } as OverlayConnectionPosition,
      bottomLeft: {
        overlayX: 'start',
        overlayY: 'bottom'
      } as OverlayConnectionPosition,
      bottomRight: {
        overlayX: 'end',
        overlayY: 'bottom'
      } as OverlayConnectionPosition,
      topCenter: {
        overlayX: 'center',
        overlayY: 'top'
      } as OverlayConnectionPosition,
      bottomCenter: {
        overlayX: 'center',
        overlayY: 'bottom'
      } as OverlayConnectionPosition
    };
    const origin = right ? (bottom ? origins.bottomRight : origins.topRight) : (bottom ? origins.bottomLeft : origins.topLeft);
    const overlay = right ? (bottom ? overlays.bottomRight : overlays.topRight) : (bottom ? overlays.bottomLeft : overlays.topLeft);
    const positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef)
      .withDefaultOffsetX(xOffset)
      .withDefaultOffsetY(yOffset).withPositions([{
        originX: origin.originX,
        originY: origin.originY,
        overlayX: overlay.overlayX,
        overlayY: overlay.overlayY
      }]);


    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy
    });

    return overlayConfig;
  }
}
