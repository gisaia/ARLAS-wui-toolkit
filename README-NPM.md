# ARLAS-wui-Toolkit

[![Build Status](https://travis-ci.org/gisaia/ARLAS-wui-toolkit.svg?branch=develop)](https://travis-ci.org/gisaia/ARLAS-wui-toolkit)
[![npm version](https://badge.fury.io/js/arlas-wui-toolkit.svg)](https://badge.fury.io/js/arlas-wui-toolkit)

ARLAS-wui-toolkit is the glue that brings the [components](https://www.npmjs.com/package/arlas-web-components) and their [contributors](https://www.npmjs.com/package/arlas-web-contributors) together in an `Analytics board`.

It's an Angular application that provides one configuration file where to declare :
- the ARLAS-server collection
- the analytics ([components](https://www.npmjs.com/package/arlas-web-components) and [contributors](https://www.npmjs.com/package/arlas-web-contributors))
- the timeline with shortcuts and datepicker
- the share component
- the tag component.


## How to use in your Angular web application

1. Install `arlas-wui-toolkit` in your Angular web application 

    ```shell
    $ npm install --save arlas-wui-toolkit
    ```

2. Declare a `config.json` file in the `src` folder. [Here](https://github.com/gisaia/ARLAS-wui-toolkit/blob/develop/src/config.json) an example of a `config.json` file.

3. Import the `ArlasToolKitModule` in your application module

    ```typescript
    @NgModule({imports: [ArlasToolKitModule]})
    export class AppModule {}
    ```

    Once imported, this module will launch the `ArlasStartupService` that parses your `config.json` file and emits an event `arlasIsUp` if the configuration file is valid. Otherwise, a list of errors on this file will be plotted in a dialog window.

4. In your bootstrap component you can inject the `ArlasStartupService` and subscribe to the `arlasIsUp` event.

    ```typescript
     constructor(private arlasStartUpService: ArlasStartupService) {
       this.arlasStartUpService.arlasIsUp.subscribe(isUp => {
         if (isUp) {
           /* your code*/
         }
       });
     }
    ```

5. You can add your own component in your application and feed it with data using an [`arlas-web-contributor`](https://www.npmjs.com/package/arlas-web-contributors). Let's say a search bar. To do so, you need to register your contributor to a [`ArlasCollaborativeSearchService`](http://docs.arlas.io/arlas-tech/current/classes/_src_app_services_startup_startup_service_.arlascollaborativesearchservice/) and a [`ArlasConfigService`](http://docs.arlas.io/arlas-tech/current/classes/_src_app_services_startup_startup_service_.arlasconfigservice/) that are provided by the `ArlasToolKitModule`.

      Inject `ArlasCollaborativeSearchService` and `ArlasConfigService` in your bootstrap component and wait for `arlasIsUp` event to declare your contributor :

      ```typescript
      constructor(private arlasStartUpService: ArlasStartupService, private collaborativeService: ArlasCollaborativeSearchService, private configService: ArlasConfigService) {
          this.arlasStartUpService.arlasIsUp.subscribe(isUp => {
              if (isUp) {
                  const chipsSearchContributor = new ChipsSearchContributor('contributorId',
                    sizeOnBackspaceBus,
                    this.collaborativeService,
                    this.configService);
                    /* your code*/
              }
          });
      }
      ```


6. In your bootstrap component, add the html tags.

    ```html
    <!-- Analytic board [groups] input is fed from the `config.json` file-->
    <arlas-analytics-board [groups]="this.configService.getValue('arlas.web.analytics')"></arlas-analytics-board>

    <!-- [timelineComponent] input is fed from the `config.json` file -->
    <arlas-timeline [timelineComponent]="this.configService.getValue('arlas.web.components.timeline')"></arlas-timeline>

    <!-- ... -->
    ```

## Documentation
Check the documentation of [components](http://docs.arlas.io/arlas-tech/current/classes/_src_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent/) and [services](http://docs.arlas.io/arlas-tech/current/classes/_src_app_services_startup_startup_service_.arlascollaborativesearchservice/) of ARLAS-wui-toolkit out.

## Versioning
We use our own `x.y.z` versioning schema, where :

- `x` : Incremented as soon as the `ARLAS-server API` changes
- `y` : Incremented as soon as a component inputs or outputs change or a new service is proposed.
- `z` : Incremented as soon as the toolkit implementation receives a fix or an enhancement.

## Authors

- Gisaia - *initial work* - [Gisaïa](https://gisaia.com/) 

See also the list of [contributors](https://github.com/gisaia/ARLAS-wui-toolkit/graphs/contributors) who participated in this project.

## LICENSE

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE.txt](https://github.com/gisaia/ARLAS-wui-toolkit/blob/develop/LICENSE.txt) file for details.
