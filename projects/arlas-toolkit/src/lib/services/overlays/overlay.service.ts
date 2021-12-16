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

import { Injectable, ElementRef, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OriginConnectionPosition, OverlayConnectionPosition, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { HistogramTooltipOverlayComponent } from '../../components/histogram-tooltip-overlay/histogram-tooltip-overlay.component';
import { ArlasOverlayRef, HISTOGRAM_TOOLTIP_DATA, DONUT_TOOLTIP_DATA } from '../../tools/utils';
import { HistogramTooltip } from 'arlas-web-components';
import { ARLASDonutTooltip } from 'arlas-d3';
import { DonutTooltipOverlayComponent } from '../../components/donut-tooltip-overlay/donut-tooltip-overlay.component';


interface HistogramTooltipConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: HistogramTooltip;
}

interface DonutTooltipConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: ARLASDonutTooltip;
}

const DEFAULT_TOOLTIP_CONFIG: HistogramTooltipConfig = {
  hasBackdrop: false,
  panelClass: 'tm-file-preview-dialog-panel'
};

@Injectable()
export class ArlasOverlayService {

  constructor(private overlay: Overlay, private parentOverlay: Overlay,    private injector: Injector    ) { }

  public openHistogramTooltip(config: HistogramTooltipConfig, elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    const dialogConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...config };

    const overlayRef = this.createHistogramTooltipOverlay(dialogConfig, elementRef, xOffset, yOffset, right);
    // Returns an OverlayRef which is a PortalHost
    const histogramActionsRef = new ArlasOverlayRef(overlayRef);
    this.attachHistogramTooltipContainer(overlayRef, dialogConfig, histogramActionsRef);

    return histogramActionsRef;
  }

  public openDonutTooltip(config: DonutTooltipConfig, elementRef: ElementRef, xOffset: number, yOffset: number, right: boolean) {
    const dialogConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...config };

    const overlayRef = this.createDonutTooltipOverlay(dialogConfig, elementRef, xOffset, yOffset, right);
    // Returns an OverlayRef which is a PortalHost
    const histogramActionsRef = new ArlasOverlayRef(overlayRef);
    this.attachDonutTooltipContainer(overlayRef, dialogConfig, histogramActionsRef);

    return histogramActionsRef;
  }

  private getOverlayConfig(config: any, elementRef: ElementRef, xOffset: number, yOffset: number,
    right: boolean): OverlayConfig {
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
    const origin = right ? origins.topRight : origins.topLeft;
    const overlay = right ? overlays.topRight : overlays.topLeft;
    //const positionStrategy = this.overlay.position().connectedTo(elementRef, origin, overlay).withOffsetX(xOffset)
    //.withOffsetY(yOffset);

    // TODO check if origin and overlay is not missing as important information
    const positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef)
    .withDefaultOffsetX(xOffset)
    .withDefaultOffsetY(yOffset);


    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy
    });

    return overlayConfig;
  }

  private createHistogramTooltipOverlay(config: HistogramTooltipConfig, elementRef: ElementRef, xOffset: number, yOffset: number,
      right: boolean) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config, elementRef, xOffset, yOffset, right);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private createDonutTooltipOverlay(config: DonutTooltipConfig, elementRef: ElementRef, xOffset: number, yOffset: number,
    right: boolean) {
  // Returns an OverlayConfig
  const overlayConfig = this.getOverlayConfig(config, elementRef, xOffset, yOffset, right);

  // Returns an OverlayRef
  return this.overlay.create(overlayConfig);
}

  private createHistogramTooltipInjector(config: HistogramTooltipConfig, ref: ArlasOverlayRef): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(ArlasOverlayRef, ref);
    injectionTokens.set(HISTOGRAM_TOOLTIP_DATA, config.data);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }

  private createDonutTooltipInjector(config: DonutTooltipConfig, ref: ArlasOverlayRef): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(ArlasOverlayRef, ref);
    injectionTokens.set(DONUT_TOOLTIP_DATA, config.data);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }

  private attachHistogramTooltipContainer(overlayRef: OverlayRef, config: HistogramTooltipConfig, arlasOverlayRef: ArlasOverlayRef) {
    const injector = this.createHistogramTooltipInjector(config, arlasOverlayRef);

    const containerPortal = new ComponentPortal(HistogramTooltipOverlayComponent, null, injector);
    const containerRef: ComponentRef<HistogramTooltipOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private attachDonutTooltipContainer(overlayRef: OverlayRef, config: DonutTooltipConfig, arlasOverlayRef: ArlasOverlayRef) {
    const injector = this.createDonutTooltipInjector(config, arlasOverlayRef);

    const containerPortal = new ComponentPortal(DonutTooltipOverlayComponent, null, injector);
    const containerRef: ComponentRef<DonutTooltipOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }
}
