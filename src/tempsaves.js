function tempsaves(storageEngine) {
    // storageEngine must support: get, set
    function readStorage() {
        return JSON.parse(storageEngine.get('NamaEditor-tempsaves', '{}'));
    }

    function writeStorage(val) {
        storageEngine.set('NamaEditor-tempsaves', JSON.stringify(val))
    }
    this.getTempsavedDocs = function () {
        return Object.keys(readStorage());
    };
    this.getTempsaves = function (docName) {
        var tempsaves = readStorage();
        return tempsaves[docName] ? tempsaves[docName] : [];
    };
    this.getTempsave = function (docName, timestamp) {
        var tempsaves = readStorage();
        if (tempsaves[docName] && tempsaves[docName].any(function (v) {
                return v.timestamp === timestamp
            })) {
            return tempsaves[docName].filter(function (v) {
                return v.timestamp === timestamp
            })[0];
        } else {
            return null;
        }
    };
    this.saveTempsave = function (docName, timestamp, value, sectionNo) {
        if (typeof sectionNo === 'undefined')
            var sectionNo = null;
        var tempsaves = readStorage();
        if (tempsaves[docName]) {
            tempsaves[docName].push({
                timestamp: timestamp,
                value: value,
                section: sectionNo
            });
        } else {
            tempsaves[docName] = [{
                timestamp: timestamp,
                value: value,
                section: sectionNo
            }];
        }
        writeStorage(tempsaves);
    };
    this.deleteTempsave = function (docName, timestamp) {
        var tempsaves = readStorage();
        if (tempsaves[docName]) {
            tempsaves[docName] = tempsaves[docName].filter(function (v) {
                return v.timestamp !== timestamp;
            })
            writeStorage(tempsaves);
        }
    };
    this.deleteTempsaves = function (docName) {
        var tempsaves = readStorage();
        if (tempsaves[docName]) {
            delete tempsaves[docName];
            writeStorage(tempsaves);
        }
    };
    this.deleteAllTempsaves = function (docName) {
        writeStorage({});
    };
}

module.exports = tempsaves;