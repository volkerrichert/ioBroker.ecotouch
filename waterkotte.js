/*
 * http://192.168.120.9/cgi/login?username=waterkotte&password=waterkotte
 * http://192.168.120.9/cgi/readTags?n=2&t1=A1&t2=A2
 */

const IP = '192.168.120.9'
const username = 'waterkotte'
const password = 'waterkotte'
const ValuesPerRequest = 15

const request = require('request');

const waterkotte = request.defaults({
  jar: true
})

const response_pattern = /#(.+)\s+([A-Z_]+)[^0-9-]+([0-9-]+)\s+([0-9-]+)/
waterkotte
    .get('http://' + IP + '/cgi/login?username=' + username + '&password=' + password, (error, response, body) => {
        const keys = Object.keys(TAGS)

        let runs = 1; // just one fpr testing // Math.floor(keys.length / ValuesPerRequest) + 1;
        for(let i = 0; i < runs; i++) {
            let tagNames = keys.slice(i * ValuesPerRequest, (i+1)*ValuesPerRequest - 1).map(key => TAGS[key].tagName)
            let params = ''
            tagNames.forEach((e, i) => {
                params += "&t" + (i+1) + "=" + e
            })
            log('?n=' + tagNames.length +params, 'info')
            waterkotte.get('http://' + IP + '/cgi/readTags?n=' + tagNames.length + params, (error, response, body) => {
                log(error)
                log(body)
                let matches = body.match(/#.+\s+([A-Z_]+)[^0-9-]+[0-9-]+\s+[0-9-]+/g)
                matches !== null && matches.forEach(function(element) {
                    log([element])
                    let match = response_pattern.exec(element)
                    log(match)
                });
            })
        }
    
     })

const TAGS = {
        // German: Außentemperatur
    TYPE_TEMPERATURE_OUTSIDE: {
            name: 'temperature_outside',
            type: 'number',
            tagName: 'A1',
    },

    // German: Außentemperatur gemittelt über 1h
    TYPE_TEMPERATURE_OUTSIDE_1H: {
            name: 'temperature_outside_1h',
            type: 'number',
            tagName: 'A2',
    },

    // German: Außentemperatur gemittelt über 24h
    TYPE_TEMPERATURE_OUTSIDE_24H: {
            name: 'temperature_outside_24h',
            type: 'number',
            tagName: 'A3',
    },

    // German: Quelleneintrittstemperatur
    TYPE_TEMPERATURE_SOURCE_IN: {
            name: 'temperature_source_in',
            type: 'number',
            tagName: 'A4',
    },

    // German: Quellenaustrittstemperatur
    TYPE_TEMPERATURE_SOURCE_OUT: {
            name: 'temperature_source_out',
            type: 'number',
            tagName: 'A5',
    },

    // German: Verdampfungstemperatur
    TYPE_TEMPERATURE_EVAPORATION: {
            name: 'temperature_evaporation',
            type: 'number',
            tagName: 'A6',
    },

    // German: Sauggastemperatur
    TYPE_TEMPERATURE_SUCTION: {
            name: 'temperature_suction',
            type: 'number',
            tagName: 'A7',
    },

    // German: Verdampfungsdruck
    TYPE_PRESSURE_EVAPORATION: {
            name: 'pressure_evaporation',
            type: 'number',
            tagName: 'A8',
    },

    // German: Temperatur Rücklauf Soll
    TYPE_TEMPERATURE_RETURN_SET: {
            name: 'temperature_return_set',
            type: 'number',
            tagName: 'A10',
    },

    // German: Temperatur Rücklauf
    TYPE_TEMPERATURE_RETURN: {
            name: 'temperature_return',
            type: 'number',
            tagName: 'A11',
    },

    // German: Temperatur Vorlauf
    TYPE_TEMPERATURE_FLOW: {
            name: 'temperature_flow',
            type: 'number',
            tagName: 'A12',
    },

    // German: Kondensationstemperatur
    TYPE_TEMPERATURE_CONDENSATION: {
            name: 'temperature_condensation',
            type: 'number',
            tagName: 'A14',
    },

    // German: Kondensationsdruck
    TYPE_PRESSURE_CONDENSATION: {
            name: 'pressure_condensation',
            type: 'number',
            tagName: 'A15',
    },

    // German: Speichertemperatur
    TYPE_TEMPERATURE_STORAGE: {
            name: 'temperature_storage',
            type: 'number',
            tagName: 'A16',
    },

    // German: Raumtemperatur
    TYPE_TEMPERATURE_ROOM: {
            name: 'temperature_room',
            type: 'number',
            tagName: 'A17',
    },

    // German: Raumtemperatur gemittelt über 1h
    TYPE_TEMPERATURE_ROOM_1H: {
            name: 'temperature_room_1h',
            type: 'number',
            tagName: 'A18',
    },

    // German: Warmwassertemperatur
    TYPE_TEMPERATURE_WATER: {
            name: 'temperature_water',
            type: 'number',
            tagName: 'A19',
    },

    // German: Pooltemperatur
    TYPE_TEMPERATURE_POOL: {
            name: 'temperature_pool',
            type: 'number',
            tagName: 'A20',
    },

    // German: Solarkollektortemperatur
    TYPE_TEMPERATURE_SOLAR: {
            name: 'temperature_solar',
            type: 'number',
            tagName: 'A21',
    },

    // German: Solarkreis Vorlauf
    TYPE_TEMPERATURE_SOLAR_FLOW: {
            name: 'temperature_solar_flow',
            type: 'number',
            tagName: 'A22',
    },

    // German: Ventilöffnung elektrisches Expansionsventil
    TYPE_POSITION_EXPANSION_VALVE: {
            name: 'position_expansion_valve',
            type: 'number',
            tagName: 'A23',
    },

    // German: elektrische Leistung Verdichter
    TYPE_POWER_COMPRESSOR: {
            name: 'power_compressor',
            type: 'number',
            tagName: 'A25',
    },

    // German: abgegebene thermische Heizleistung der Wärmepumpe
    TYPE_POWER_HEATING: {
            name: 'power_heating',
            type: 'number',
            tagName: 'A26',
    },

    // German: abgegebene thermische KälteLeistung der Wärmepumpe
    TYPE_POWER_COOLING: {
            name: 'power_cooling',
            type: 'number',
            tagName: 'A27',
    },

    // German: COP Heizleistung
    TYPE_COP_HEATING: {
            name: 'cop_heating',
            type: 'number',
            tagName: 'A28',
    },

    // German: COP Kälteleistungleistung
    TYPE_COP_COOLING: {
            name: 'cop_cooling',
            type: 'number',
            tagName: 'A29',
    },

    // German: Aktuelle Heizkreistemperatur
    TYPE_TEMPERATURE_HEATING: {
            name: 'temperature_heating_return',
            type: 'number',
            tagName: 'A30',
    },

    // German: Geforderte Temperatur im Heizbetrieb
    TYPE_TEMPERATURE_HEATING_SET: {
            name: 'temperature_heating_set',
            type: 'number',
            tagName: 'A31',
    },

    // German: Sollwertvorgabe Heizkreistemperatur
    TYPE_TEMPERATURE_HEATING_SET2: {
            name: 'temperature_heating_set2',
            type: 'number',
            tagName: 'A32',
    },

    // German: Aktuelle Kühlkreistemperatur
    TYPE_TEMPERATURE_COOLING: {
            name: 'temperature_cooling_return',
            type: 'number',
            tagName: 'A33',
    },

    // German: Geforderte Temperatur im Kühlbetrieb
    TYPE_TEMPERATURE_COOLING_SET: {
            name: 'temperature_cooling_set',
            type: 'number',
            tagName: 'A34',
    },

    // German: Sollwertvorgabe Kühlbetrieb
    TYPE_TEMPERATURE_COOLING_SET2: {
            name: 'temperature_cooling_set2',
            type: 'number',
            tagName: 'A35',
    },

    // German: Sollwert Warmwassertemperatur
    TYPE_TEMPERATURE_WATER_SET: {
            name: 'temperature_water_set',
            type: 'number',
            tagName: 'A37',
    },

    // German: Sollwertvorgabe Warmwassertemperatur
    TYPE_TEMPERATURE_WATER_SET2: {
            name: 'temperature_water_set2',
            type: 'number',
            tagName: 'A38',
    },

    // German: Sollwert Poolwassertemperatur
    TYPE_TEMPERATURE_POOL_SET: {
            name: 'temperature_pool_set',
            type: 'number',
            tagName: 'A40',
    },

    // German: Sollwertvorgabe Poolwassertemperatur
    TYPE_TEMPERATURE_POOL_SET2: {
            name: 'temperature_pool_set2',
            type: 'number',
            tagName: 'A41',
    },

    // German: geforderte Verdichterleistung
    TYPE_COMPRESSOR_POWER: {
            name: 'compressor_power',
            type: 'number',
            tagName: 'A50',
    },

    // German: % Heizungsumwälzpumpe
    TYPE_PERCENT_HEAT_CIRC_PUMP: {
            name: 'percent_heat_circ_pump',
            type: 'number',
            tagName: 'A51',
    },

    // German: % Quellenpumpe
    TYPE_PERCENT_SOURCE_PUMP: {
            name: 'percent_source_pump',
            type: 'number',
            tagName: 'A52',
    },

    // German: % Leistung Verdichter
    TYPE_PERCENT_COMPRESSOR: {
            name: 'percent_compressor',
            type: 'number',
            tagName: 'A58',
    },

    // German: Hysterese Heizung
    TYPE_HYSTERESIS_HEATING: {
            name: 'hysteresis_heating',
            type: 'number',
            tagName: 'A61',
    },

    // German: Außentemperatur gemittelt über 1h (scheinbar identisch zu A2)
    TYPE_TEMPERATURE2_OUTSIDE_1H: {
            name: 'temperature2_outside_1h',
            type: 'number',
            tagName: 'A90',
    },

    // German: Heizkurve - nviNormAussen
    TYPE_NVINORMAUSSEN: {
            name: 'nviNormAussen',
            type: 'number',
            tagName: 'A91',
    },

    // German: Heizkurve - nviHeizkreisNorm
    TYPE_NVIHEIZKREISNORM: {
            name: 'nviHeizkreisNorm',
            type: 'number',
            tagName: 'A92',
    },

    // German: Heizkurve - nviTHeizgrenze
    TYPE_NVITHEIZGRENZE: {
            name: 'nviTHeizgrenze',
            type: 'number',
            tagName: 'A93',
    },

    // German: Heizkurve - nviTHeizgrenzeSoll
    TYPE_NVITHEIZGRENZESOLL: {
            name: 'nviTHeizgrenzeSoll',
            type: 'number',
            tagName: 'A94',
    },

    // German: undokumentiert: Heizkurve max. VL-Temp (??)
    TYPE_MAX_VL_TEMP: {
            name: 'maxVLTemp',
            type: 'number',
            tagName: 'A95',
    },

    // German: undokumentiert: Heizkreis Soll-Temp bei 0° Aussen
    TYPE_TEMP_SET_0DEG: {
            name: 'tempSet0Deg',
            type: 'number',
            tagName: 'A97',
    },

    // German: undokumentiert: Kühlen Einschalt-Temp. Aussentemp (??)
    TYPE_COOLENABLETEMP: {
            name: 'coolEnableTemp',
            type: 'number',
            tagName: 'A108',
    },

    // German: Heizkurve - nviSollKuehlen
    TYPE_NVITSOLLKUEHLEN: {
            name: 'nviSollKuehlen',
            type: 'number',
            tagName: 'A109',
    },

    // German: Temperaturveränderung Heizkreis bei PV-Ertrag
    TYPE_TEMPCHANGE_HEATING_PV: {
            name: 'tempchange_heating_pv',
            type: 'number',
            tagName: 'A682',
    },

    // German: Temperaturveränderung Kühlkreis bei PV-Ertrag
    TYPE_TEMPCHANGE_COOLING_PV: {
            name: 'tempchange_cooling_pv',
            type: 'number',
            tagName: 'A683',
    },

    // German: Temperaturveränderung Warmwasser bei PV-Ertrag
    TYPE_TEMPCHANGE_WARMWATER_PV: {
            name: 'tempchange_warmwater_pv',
            type: 'number',
            tagName: 'A684',
    },

    // German: Temperaturveränderung Pool bei PV-Ertrag
    TYPE_TEMPCHANGE_POOL_PV: {
            name: 'tempchange_pool_pv',
            type: 'number',
            tagName: 'A685',
    },

    // German: undokumentiert: Firmware-Version Regler
    // value 10401 => 01.04.01
    TYPE_VERSION_CONTROLLER: {
            name: 'version_controller',
            type: 'number',
            tagName: 'I1',
    },

    // German: undokumentiert: Firmware-Build Regler
    TYPE_VERSION_CONTROLLER_BUILD: {
            name: 'version_controller_build',
            type: 'number',
            tagName: 'I2',
    },

    // German: undokumentiert: BIOS-Version
    // value 620 => 06.20
    TYPE_VERSION_BIOS: {
            name: 'version_bios',
            type: 'number',
            tagName: 'I3',
    },

    // German: undokumentiert: Datum: Tag
    TYPE_DATE_DAY: {
            name: 'date_day',
            type: 'number',
            tagName: 'I5',
    },

    // German: undokumentiert: Datum: Monat
    TYPE_DATE_MONTH: {
            name: 'date_month',
            type: 'number',
            tagName: 'I6',
    },

    // German: undokumentiert: Datum: Jahr
    TYPE_DATE_YEAR: {
            name: 'date_year',
            type: 'number',
            tagName: 'I7',
    },

    // German: undokumentiert: Uhrzeit: Stunde
    TYPE_TIME_HOUR: {
            name: 'time_hour',
            type: 'number',
            tagName: 'I8',
    },

    // German: undokumentiert: Uhrzeit: Minute
    TYPE_TIME_MINUTE: {
            name: 'time_minute',
            type: 'number',
            tagName: 'I9',
    },

    // German: Betriebsstunden Verdichter 1
    TYPE_OPERATING_HOURS_COMPRESSOR1: {
            name: 'operating_hours_compressor1',
            type: 'number',
            tagName: 'I10',
    },

    // German: Betriebsstunden Verdichter 2
    TYPE_OPERATING_HOURS_COMPRESSOR2: {
            name: 'operating_hours_compressor2',
            type: 'number',
            tagName: 'I14',
    },

    // German: Betriebsstunden Heizungsumwälzpumpe
    TYPE_OPERATING_HOURS_CIRCULATION_PUMP: {
            name: 'operating_hours_circulation_pump',
            type: 'number',
            tagName: 'I18',
    },

    // German: Betriebsstunden Quellenpumpe
    TYPE_OPERATING_HOURS_SOURCE_PUMP: {
            name: 'operating_hours_source_pump',
            type: 'number',
            tagName: 'I20',
    },

    // German: Betriebsstunden Solarkreis
    TYPE_OPERATING_HOURS_SOLAR: {
            name: 'operating_hours_solar',
            type: 'number',
            tagName: 'I22',
    },

    // German: Handabschaltung Heizbetrieb
    TYPE_ENABLE_HEATING: {
            name: 'enable_heating',
            type: 'boolean',
            tagName: 'I30',
    },

    // German: Handabschaltung Kühlbetrieb
    TYPE_ENABLE_COOLING: {
            name: 'enable_cooling',
            type: 'boolean',
            tagName: 'I31',
    },

    // German: Handabschaltung Warmwasserbetrieb
    TYPE_ENABLE_WARMWATER: {
            name: 'enable_warmwater',
            type: 'boolean',
            tagName: 'I32',
    },

    // German: Handabschaltung Pool_Heizbetrieb
    TYPE_ENABLE_POOL: {
            name: 'enable_pool',
            type: 'boolean',
            tagName: 'I33',
    },

    // German: undokumentiert: vermutlich Betriebsmodus PV 0=Aus, 1=Auto, 2=Ein
    TYPE_ENABLE_PV: {
            name: 'enable_pv',
            type: 'number',
            tagName: 'I41',
    },

    // German: Status der Wärmepumpenkomponenten
    TYPE_STATE: {
            name: 'state',
            type: 'number',
            tagName: 'I51',
    },

    // German: Status der Wärmepumpenkomponenten: Quellenpumpe
    TYPE_STATE_SOURCEPUMP: {
            name: 'state_sourcepump',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 0,
    },

    // German: Status der Wärmepumpenkomponenten: Heizungsumwälzpumpe
    TYPE_STATE_HEATINGPUMP: {
            name: 'state_heatingpump',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 1,
    },

    // German: Status der Wärmepumpenkomponenten: Freigabe Regelung EVD /
    // Magnetventil
    TYPE_STATE_EVD: {
            name: 'state_evd',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 2,
    },

    // German: Status der Wärmepumpenkomponenten: Verdichter 1
    TYPE_STATE_compressor1: {
            name: 'state_compressor1',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 3,
    },

    // German: Status der Wärmepumpenkomponenten: Verdichter 2
    TYPE_STATE_compressor2: {
            name: 'state_compressor2',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 4,
    },

    // German: Status der Wärmepumpenkomponenten: externer Wärmeerzeuger
    TYPE_STATE_extheater: {
            name: 'state_extheater',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 5,
    },

    // German: Status der Wärmepumpenkomponenten: Alarmausgang
    TYPE_STATE_alarm: {
            name: 'state_alarm',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 6,
    },

    // German: Status der Wärmepumpenkomponenten: Motorventil Kühlbetrieb
    TYPE_STATE_cooling: {
            name: 'state_cooling',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 7,
    },

    // German: Status der Wärmepumpenkomponenten: Motorventil Warmwasser
    TYPE_STATE_water: {
            name: 'state_water',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 8,
    },

    // German: Status der Wärmepumpenkomponenten: Motorventil Pool
    TYPE_STATE_pool: {
            name: 'state_pool',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 9,
    },

    // German: Status der Wärmepumpenkomponenten: Solarbetrieb
    TYPE_STATE_solar: {
            name: 'state_solar',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 10,
    },

    // German: Status der Wärmepumpenkomponenten: 4-Wegeventil im Kältekreis
    TYPE_STATE_cooling4way: {
            name: 'state_cooling4way',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 11,
    },

    // German: Meldungen von Ausfällen F0xx die zum Wärmepumpenausfall führen
    TYPE_ALARM: {
            name: 'alarm',
            type: 'number',
            tagName: 'I52',
    },

    // German: Unterbrechungen
    TYPE_INTERRUPTIONS: {
            name: 'interruptions',
            type: 'number',
            tagName: 'I53',
    },

    // German: Serviceebene (0: normal, 1: service)
    TYPE_STATE_SERVICE: {
            name: 'state_service',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I135',
    },

    // German: Temperaturanpassung für die Heizung
    TYPE_ADAPT_HEATING: {
            name: 'adapt_heating',
            type: 'number',
            tagName: 'I263',
    },

    // German: Handschaltung Heizungspumpe (H-0-A)
    // H:Handschaltung Ein 0:Aus A:Automatik
    // Kodierung: 0:? 1:? 2:Automatik
    TYPE_MANUAL_HEATINGPUMP: {
            name: 'manual_heatingpump',
            type: 'number',
            tagName: 'I1270',
    },

    // German: Handschaltung Quellenpumpe (H-0-A)
    TYPE_MANUAL_SOURCEPUMP: {
            name: 'manual_sourcepump',
            type: 'number',
            tagName: 'I1281',
    },

    // German: Handschaltung Solarpumpe 1 (H-0-A)
    TYPE_MANUAL_SOLARPUMP1: {
            name: 'manual_solarpump1',
            type: 'number',
            tagName: 'I1287',
    },

    // German: Handschaltung Solarpumpe 2 (H-0-A)
    TYPE_MANUAL_SOLARPUMP2: {
            name: 'manual_solarpump2',
            type: 'number',
            tagName: 'I1289',
    },

    // German: Handschaltung Speicherladepumpe (H-0-A)
    TYPE_MANUAL_TANKPUMP: {
            name: 'manual_tankpump',
            type: 'number',
            tagName: 'I1291',
    },

    // German: Handschaltung Brauchwasserventil (H-0-A)
    TYPE_MANUAL_VALVE: {
            name: 'manual_valve',
            type: 'number',
            tagName: 'I1293',
    },

    // German: Handschaltung Poolventil (H-0-A)
    TYPE_MANUAL_POOLVALVE: {
            name: 'manual_poolvalve',
            type: 'number',
            tagName: 'I1295',
    },

    // German: Handschaltung Kühlventil (H-0-A)
    TYPE_MANUAL_COOLVALVE: {
            name: 'manual_coolvalve',
            type: 'number',
            tagName: 'I1297',
    },

    // German: Handschaltung Vierwegeventil (H-0-A)
    TYPE_MANUAL_4WAYVALVE: {
            name: 'manual_4wayvalve',
            type: 'number',
            tagName: 'I1299',
    },

    // German: Handschaltung Multiausgang Ext. (H-0-A)
    TYPE_MANUAL_MULTIEXT: {
            name: 'manual_multiext',
            type: 'number',
            tagName: 'I1319',
    },

    // German: Umgebung
    TYPE_TEMPERATURE_SURROUNDING: {
            name: 'temperature_surrounding',
            type: 'number',
            tagName: 'I2020',
            divisor: 100,
    },

    // German: Sauggas
    TYPE_TEMPERATURE_SUCTION_AIR: {
            name: 'temperature_suction_air',
            type: 'number',
            tagName: 'I2021',
            divisor: 100,
    },

    // German: Ölsumpf
    TYPE_TEMPERATURE_SUMP: {
            name: 'temperature_sump',
            type: 'number',
            tagName: 'I2023',
            divisor: 100,
    },
}

for (const [key, tag] of Object.entries(TAGS)) {
    createState('waterkotte.' + tag.name, {
        name: tag.name,
        type: tag.type,
        write: false,
        role: (tag.role?tag.role:'value')
    })
}
