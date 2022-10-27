exports.convertUnderscore = (data) => {
    if (data.length > 0) {
        data.map(item => {
            Object.keys(item.dataValues).forEach(key => {
                item.dataValues[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = item.dataValues[key];
                if (key !== key.split(/(?=[A-Z])/).join('_').toLowerCase()) delete item.dataValues[key];
            });
        });
    }
    if (typeof data === 'object') {
        Object.keys(data.dataValues).forEach(key => {

            data.dataValues[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = data.dataValues[key];
            if (key !== key.split(/(?=[A-Z])/).join('_').toLowerCase()) delete data.dataValues[key];
        });
    }
    return data;
}