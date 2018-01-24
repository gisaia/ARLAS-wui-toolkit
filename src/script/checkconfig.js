const ajv = require('ajv');
var clc = require('cli-color');
var rootContributorConfSchema = require('./node_modules/arlas-web-contributors/jsonSchemas/rootContributorConf.schema.json');
var histogramContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/histogramContributorConf.schema.json');
var swimlaneContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/swimlaneContributorConf.schema.json');
var powerbarsContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/powerbarsContributorConf.schema.json');
var resultlistContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/resultlistContributorConf.schema.json');
var mapContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/mapContributorConf.schema.json');
var chipssearchContributorConf = require('./node_modules/arlas-web-contributors/jsonSchemas/chipssearchContributorConf.schema.json');
var histogramConf = require('./node_modules/arlas-web-components/histogram/histogram.schema.json');
var swimlaneConf = require('./node_modules/arlas-web-components/histogram/swimlane.schema.json');
var powerbarsConf = require('./node_modules/arlas-web-components/powerbars/powerbars.schema.json');
var arlasconfig = require('./node_modules/arlas-wui-toolkit/services/startup/arlasconfig.schema.json')
var config = require('./src/config.json')

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.green;

var validateConfig = ajv()
    .addSchema(rootContributorConfSchema)
    .addSchema(histogramContributorConf)
    .addSchema(swimlaneContributorConf)
    .addSchema(powerbarsContributorConf)
    .addSchema(resultlistContributorConf)
    .addSchema(mapContributorConf)
    .addSchema(chipssearchContributorConf)
    .addSchema(histogramConf)
    .addSchema(swimlaneConf)
    .addSchema(powerbarsConf)
    .compile(arlasconfig);

if (validateConfig(config)) {
    console.log(notice('Arlas configuration is OK.'))
} else {
    console.log(error('Error found in Arlas configuration.'))
    console.log(error(validateConfig.errors[0].dataPath + ' ' + validateConfig.errors[0].message))
}
