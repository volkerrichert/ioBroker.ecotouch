/*
 * http://192.168.120.9/cgi/login?username=waterkotte&password=waterkotte
 * http://192.168.120.9/cgi/readTags?n=2&t1=A1&t2=A2
 */

const DEBUG = false
const IP = '192.168.120.9'
const username = 'waterkotte'
const password = 'waterkotte'
const ValuesPerRequest = 15


var rp = require("request-promise").defaults({jar: true});

const response_pattern = /#(.+)\s+([A-Z_]+)[^0-9-]+([0-9-]+)\s+([0-9-]+)/;

const convertValue = (tag, data) => {
    switch(tag.type) {
        case 'number':
            return parseFloat(data) / (tag.divisor?tag.divisor:1)

        case 'boolean':
            if (tag.bitnum) {
                let mask = 1 << (tag.bitnum-1);
                return (parseInt(data) & mask) != 0
            }
            return data !== '0'

        case 'string':
            return data
    }

    return null
}

const run = (async () => {
    await rp.get('http://' + IP + '/cgi/login?username=' + username + '&password=' + password, async (error, response, body) => {
        const keys = Object.keys(TAGS)

        let runs = Math.floor(keys.length / ValuesPerRequest) + 1;
        for(let i = 0; i < runs; i++) {
            let tagNames = keys.slice(i * ValuesPerRequest, (i+1)*ValuesPerRequest).map(key => TAGS[key].tagName)
            let params = ''
            tagNames.forEach((e, i) => {
                params += "&t" + (i+1) + "=" + e
            })
            if (tagNames.length > 0) {
                DEBUG && log('?n=' + tagNames.length +params, 'info')
                const result = await rp('http://' + IP + '/cgi/readTags?n=' + tagNames.length + params);

                let matches = result.match(/#.+\s+([A-Z_]+)[^0-9-]+[0-9-]+\s+[0-9-]+/g)
                
                matches !== null && matches.forEach((element, index) => {
                    let match = response_pattern.exec(element)
                    if (match[2] === "S_OK") {
                        let tag = TAGS[match[1]]
                        DEBUG && log (tag)
                        DEBUG && log(match[4])
                        let value = convertValue(tag, match[4])
                        setState('javascript.0.waterkotte.' + tag.name, value, true);
                        if (tag.sub) {
                            tag.sub.forEach(subtag => {
                                DEBUG && log(subtag)
                                let value = convertValue(subtag, match[4])
                                setState('javascript.0.waterkotte.' + subtag.name, value, true);
                            })
                        }
                        
                    } else {
                        log("fail " + match[0], "error")
                    }              
                })
            }
            
        }
    
     })
})

const TAGS = {
        // German: Außentemperatur
    A1: {
        name: 'temperature_outside',
        type: 'number',
        tagName: 'A1',
    },

    // German: Außentemperatur gemittelt über 1h
    A2: {
        name: 'temperature_outside_1h',
        type: 'number',
        tagName: 'A2',
    },

    // German: Außentemperatur gemittelt über 24h
    A3: {
        name: 'temperature_outside_24h',
        type: 'number',
        tagName: 'A3',
    },

    // German: Quelleneintrittstemperatur
    A4: {
        name: 'temperature_source_in',
        type: 'number',
        tagName: 'A4',
    },

    // German: Quellenaustrittstemperatur
    A5: {
        name: 'temperature_source_out',
        type: 'number',
        tagName: 'A5',
    },

    // German: Verdampfungstemperatur
    A6: {
        name: 'temperature_evaporation',
        type: 'number',
        tagName: 'A6',
    },

    // German: Sauggastemperatur
    A7: {
        name: 'temperature_suction',
        type: 'number',
        tagName: 'A7',
    },

    // German: Verdampfungsdruck
    A8: {
        name: 'pressure_evaporation',
        type: 'number',
        tagName: 'A8',
    },

    // German: Temperatur Rücklauf Soll
    A10: {
        name: 'temperature_return_set',
        type: 'number',
        tagName: 'A10',
    },

    // German: Temperatur Rücklauf
    A11: {
        name: 'temperature_return',
        type: 'number',
        tagName: 'A11',
    },

    // German: Temperatur Vorlauf
    A12: {
        name: 'temperature_flow',
        type: 'number',
        tagName: 'A12',
    },

    // German: Kondensationstemperatur
    A14: {
        name: 'temperature_condensation',
        type: 'number',
        tagName: 'A14',
    },

    // German: Kondensationsdruck
    A15: {
        name: 'pressure_condensation',
        type: 'number',
        tagName: 'A15',
    },

    // German: Speichertemperatur
    A16: {
        name: 'temperature_storage',
        type: 'number',
        tagName: 'A16',
    },

    // German: Raumtemperatur
    A17: {
        name: 'temperature_room',
        type: 'number',
        tagName: 'A17',
    },

    // German: Raumtemperatur gemittelt über 1h
    A18: {
        name: 'temperature_room_1h',
        type: 'number',
        tagName: 'A18',
    },

    // German: Warmwassertemperatur
    A19: {
        name: 'temperature_water',
        type: 'number',
        tagName: 'A19',
    },

    // German: Pooltemperatur
    A20: {
        name: 'temperature_pool',
        type: 'number',
        tagName: 'A20',
    },

    // German: Solarkollektortemperatur
    A21: {
        name: 'temperature_solar',
        type: 'number',
        tagName: 'A21',
    },

    // German: Solarkreis Vorlauf
    A22: {
        name: 'temperature_solar_flow',
        type: 'number',
        tagName: 'A22',
    },

    // German: Ventilöffnung elektrisches Expansionsventil
    A23: {
        name: 'position_expansion_valve',
        type: 'number',
        tagName: 'A23',
    },

    // German: elektrische Leistung Verdichter
    A25: {
        name: 'power_compressor',
        type: 'number',
        tagName: 'A25',
    },

    // German: abgegebene thermische Heizleistung der Wärmepumpe
    A26: {
        name: 'power_heating',
        type: 'number',
        tagName: 'A26',
    },

    // German: abgegebene thermische KälteLeistung der Wärmepumpe
    A27: {
        name: 'power_cooling',
        type: 'number',
        tagName: 'A27',
    },

    // German: COP Heizleistung
    A28: {
        name: 'cop_heating',
        type: 'number',
        tagName: 'A28',
    },

    // German: COP Kälteleistungleistung
    A29: {
        name: 'cop_cooling',
        type: 'number',
        tagName: 'A29',
    },

    // German: Aktuelle Heizkreistemperatur
    A30: {
        name: 'temperature_heating_return',
        type: 'number',
        tagName: 'A30',
    },

    // German: Geforderte Temperatur im Heizbetrieb
    A31: {
        name: 'temperature_heating_set',
        type: 'number',
        tagName: 'A31',
    },

    // German: Sollwertvorgabe Heizkreistemperatur
    A32: {
        name: 'temperature_heating_set2',
        type: 'number',
        tagName: 'A32',
    },

    // German: Aktuelle Kühlkreistemperatur
    A33: {
        name: 'temperature_cooling_return',
        type: 'number',
        tagName: 'A33',
    },

    // German: Geforderte Temperatur im Kühlbetrieb
    A34: {
        name: 'temperature_cooling_set',
        type: 'number',
        tagName: 'A34',
    },

    // German: Sollwertvorgabe Kühlbetrieb
    A35: {
        name: 'temperature_cooling_set2',
        type: 'number',
        tagName: 'A35',
    },

    // German: Sollwert Warmwassertemperatur
    A37: {
        name: 'temperature_water_set',
        type: 'number',
        tagName: 'A37',
    },

    // German: Sollwertvorgabe Warmwassertemperatur
    A38: {
        name: 'temperature_water_set2',
        type: 'number',
        tagName: 'A38',
    },

    // German: Sollwert Poolwassertemperatur
    A40: {
        name: 'temperature_pool_set',
        type: 'number',
        tagName: 'A40',
    },

    // German: Sollwertvorgabe Poolwassertemperatur
    A41: {
        name: 'temperature_pool_set2',
        type: 'number',
        tagName: 'A41',
    },

    // German: geforderte Verdichterleistung
    A50: {
        name: 'compressor_power',
        type: 'number',
        tagName: 'A50',
    },

    // German: % Heizungsumwälzpumpe
    A51: {
        name: 'percent_heat_circ_pump',
        type: 'number',
        tagName: 'A51',
    },

    // German: % Quellenpumpe
    A52: {
        name: 'percent_source_pump',
        type: 'number',
        tagName: 'A52',
    },

    // German: % Leistung Verdichter
    A58: {
        name: 'percent_compressor',
        type: 'number',
        tagName: 'A58',
    },

    // German: Hysterese Heizung
    A61: {
        name: 'hysteresis_heating',
        type: 'number',
        tagName: 'A61',
    },

    // German: Außentemperatur gemittelt über 1h (scheinbar identisch zu A2)
    A90: {
        name: 'temperature2_outside_1h',
        type: 'number',
        tagName: 'A90',
    },

    // German: Heizkurve - nviNormAussen
    A91: {
        name: 'nviNormAussen',
        type: 'number',
        tagName: 'A91',
    },

    // German: Heizkurve - nviHeizkreisNorm
    A92: {
        name: 'nviHeizkreisNorm',
        type: 'number',
        tagName: 'A92',
    },

    // German: Heizkurve - nviTHeizgrenze
    A93: {
        name: 'nviTHeizgrenze',
        type: 'number',
        tagName: 'A93',
    },

    // German: Heizkurve - nviTHeizgrenzeSoll
    A94: {
        name: 'nviTHeizgrenzeSoll',
        type: 'number',
        tagName: 'A94',
    },

    // German: undokumentiert: Heizkurve max. VL-Temp (??)
    A95: {
        name: 'maxVLTemp',
        type: 'number',
        tagName: 'A95',
    },

    // German: undokumentiert: Heizkreis Soll-Temp bei 0° Aussen
    A97: {
        name: 'tempSet0Deg',
        type: 'number',
        tagName: 'A97',
    },

    // German: undokumentiert: Kühlen Einschalt-Temp. Aussentemp (??)
    A108: {
        name: 'coolEnableTemp',
        type: 'number',
        tagName: 'A108',
    },

    // German: Heizkurve - nviSollKuehlen
    A109: {
        name: 'nviSollKuehlen',
        type: 'number',
        tagName: 'A109',
    },

    // German: Temperaturveränderung Heizkreis bei PV-Ertrag
    A682: {
        name: 'tempchange_heating_pv',
        type: 'number',
        tagName: 'A682',
    },

    // German: Temperaturveränderung Kühlkreis bei PV-Ertrag
    A683: {
        name: 'tempchange_cooling_pv',
        type: 'number',
        tagName: 'A683',
    },

    // German: Temperaturveränderung Warmwasser bei PV-Ertrag
    A684: {
        name: 'tempchange_warmwater_pv',
        type: 'number',
        tagName: 'A684',
    },

    // German: Temperaturveränderung Pool bei PV-Ertrag
    A685: {
        name: 'tempchange_pool_pv',
        type: 'number',
        tagName: 'A685',
    },

    // German: undokumentiert: Firmware-Version Regler
    // value 10401 => 01.04.01
    I1: {
        name: 'version_controller',
        type: 'number',
        tagName: 'I1',
    },

    // German: undokumentiert: Firmware-Build Regler
    I2: {
        name: 'version_controller_build',
        type: 'number',
        tagName: 'I2',
    },

    // German: undokumentiert: BIOS-Version
    // value 620 => 06.20
    I3: {
        name: 'version_bios',
        type: 'number',
        tagName: 'I3',
    },

    // German: undokumentiert: Datum: Tag
    I5: {
        name: 'date_day',
        type: 'number',
        tagName: 'I5',
    },

    // German: undokumentiert: Datum: Monat
    I6: {
        name: 'date_month',
        type: 'number',
        tagName: 'I6',
    },

    // German: undokumentiert: Datum: Jahr
    I7: {
        name: 'date_year',
        type: 'number',
        tagName: 'I7',
    },

    // German: undokumentiert: Uhrzeit: Stunde
    I8: {
        name: 'time_hour',
        type: 'number',
        tagName: 'I8',
    },

    // German: undokumentiert: Uhrzeit: Minute
    I9: {
        name: 'time_minute',
        type: 'number',
        tagName: 'I9',
    },

    // German: Betriebsstunden Verdichter 1
    I10: {
        name: 'operating_hours_compressor1',
        type: 'number',
        tagName: 'I10',
    },

    // German: Betriebsstunden Verdichter 2
    I14: {
        name: 'operating_hours_compressor2',
        type: 'number',
        tagName: 'I14',
    },

    // German: Betriebsstunden Heizungsumwälzpumpe
    I18: {
        name: 'operating_hours_circulation_pump',
        type: 'number',
        tagName: 'I18',
    },

    // German: Betriebsstunden Quellenpumpe
    I20: {
        name: 'operating_hours_source_pump',
        type: 'number',
        tagName: 'I20',
    },

    // German: Betriebsstunden Solarkreis
    I22: {
        name: 'operating_hours_solar',
        type: 'number',
        tagName: 'I22',
    },

    // German: Handabschaltung Heizbetrieb
    I30: {
        name: 'enable_heating',
        type: 'boolean',
        tagName: 'I30',
    },

    // German: Handabschaltung Kühlbetrieb
    I31: {
        name: 'enable_cooling',
        type: 'boolean',
        tagName: 'I31',
    },

    // German: Handabschaltung Warmwasserbetrieb
    I32: {
        name: 'enable_warmwater',
        type: 'boolean',
        tagName: 'I32',
    },

    // German: Handabschaltung Pool_Heizbetrieb
    I33: {
        name: 'enable_pool',
        type: 'boolean',
        tagName: 'I33',
    },

    // German: undokumentiert: vermutlich Betriebsmodus PV 0=Aus, 1=Auto, 2=Ein
    I41: {
        name: 'enable_pv',
        type: 'number',
        tagName: 'I41',
    },

    // German: Status der Wärmepumpenkomponenten
    I51: {
        name: 'state',
        type: 'number',
        tagName: 'I51',
        sub: [{
            name: 'state_sourcepump',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 0,
        }, {
            name: 'state_heatingpump',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 1,
        }, {
            name: 'state_evd',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 2,
        }, {
            name: 'state_compressor1',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 3,
        }, {
            name: 'state_compressor2',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 4,
        }, {
            name: 'state_extheater',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 5,
        }, {
            name: 'state_alarm',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 6,
        }, {
            name: 'state_cooling',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 7,
        }, {
            name: 'state_water',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 8,
        }, {
            name: 'state_pool',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 9,
        }, {
            name: 'state_solar',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 10,
        }, {
            name: 'state_cooling4way',
            type: 'boolean',
            role: 'indicator.working',
            tagName: 'I51',
            bitnum: 11,
        }]
    },

    // German: Meldungen von Ausfällen F0xx die zum Wärmepumpenausfall führen
    I52: {
        name: 'alarm',
        type: 'number',
        tagName: 'I52',
    },

    // German: Unterbrechungen
    I53: {
        name: 'interruptions',
        type: 'number',
        tagName: 'I53',
    },

    // German: Serviceebene (0: normal, 1: service)
    I135: {
        name: 'state_service',
        type: 'boolean',
        role: 'indicator.working',
        tagName: 'I135',
    },

    // German: Temperaturanpassung für die Heizung
    I263: {
        name: 'adapt_heating',
        type: 'number',
        tagName: 'I263',
    },

    // German: Handschaltung Heizungspumpe (H-0-A)
    // H:Handschaltung Ein 0:Aus A:Automatik
    // Kodierung: 0:? 1:? 2:Automatik
    I1270: {
        name: 'manual_heatingpump',
        type: 'number',
        tagName: 'I1270',
    },

    // German: Handschaltung Quellenpumpe (H-0-A)
    I1281: {
        name: 'manual_sourcepump',
        type: 'number',
        tagName: 'I1281',
    },

    // German: Handschaltung Solarpumpe 1 (H-0-A)
    I1287: {
        name: 'manual_solarpump1',
        type: 'number',
        tagName: 'I1287',
    },

    // German: Handschaltung Solarpumpe 2 (H-0-A)
    I1289: {
        name: 'manual_solarpump2',
        type: 'number',
        tagName: 'I1289',
    },

    // German: Handschaltung Speicherladepumpe (H-0-A)
    I1291: {
        name: 'manual_tankpump',
        type: 'number',
        tagName: 'I1291',
    },

    // German: Handschaltung Brauchwasserventil (H-0-A)
    I1293: {
        name: 'manual_valve',
        type: 'number',
        tagName: 'I1293',
    },

    // German: Handschaltung Poolventil (H-0-A)
    I1295: {
        name: 'manual_poolvalve',
        type: 'number',
        tagName: 'I1295',
    },

    // German: Handschaltung Kühlventil (H-0-A)
    I1297: {
        name: 'manual_coolvalve',
        type: 'number',
        tagName: 'I1297',
    },

    // German: Handschaltung Vierwegeventil (H-0-A)
    I1299: {
        name: 'manual_4wayvalve',
        type: 'number',
        tagName: 'I1299',
    },

    // German: Handschaltung Multiausgang Ext. (H-0-A)
    I1319: {
            name: 'manual_multiext',
            type: 'number',
            tagName: 'I1319',
    },

    // German: Umgebung
    I2020: {
            name: 'temperature_surrounding',
            type: 'number',
            tagName: 'I2020',
            divisor: 100,
    },

    // German: Sauggas
    I2021: {
            name: 'temperature_suction_air',
            type: 'number',
            tagName: 'I2021',
            divisor: 100,
    },

    // German: Ölsumpf
    I2023: {
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

if (DEBUG) setState('javascript.0.scriptEnabled.Haus.Watterkotte', false)
else schedule("*/1 * * * *", run)

