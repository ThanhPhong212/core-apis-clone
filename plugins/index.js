exports.convertUnderscore = (data) => {
    console.log(typeof data);
    if (data.length > 0) {
        data.map(item => {
            Object.keys(item.dataValues).forEach(key => {
                item.dataValues[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = item.dataValues[key];
                if (key !== key.split(/(?=[A-Z])/).join('_').toLowerCase()) delete item.dataValues[key];
            });
        });
    }
    if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = data[key];
            if (key !== key.split(/(?=[A-Z])/).join('_').toLowerCase()) delete data[key];
        });
    }
    return data;
}