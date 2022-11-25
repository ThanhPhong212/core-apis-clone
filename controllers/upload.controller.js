exports.uploadFile = async (req, res) => {
    const { type } = req.body
    if (!type) {
        return res.status(400).send({
            status: false,
            message: 'No file type selected'
        });
    }
    const file = req.files.file;
    const date = new Date();
    file.name = file.md5 + '-' + date.valueOf() + '.' + file.name.split('.').pop();
    const path = './tmp/' + type + '/' + file.name;
    await file.mv(path, function (err) {
        if (err) {
            return res.status(500).send({
                status: false,
                message: err.message,
            });
        }
        res.status(200).send({
            status: true,
            message: '',
            data: { file_name: file.name }
        });
    });
}

exports.uploadAvatar = async (req, res) => {
    const file = req.files.file;
    const date = new Date();
    file.name = file.md5 + '-' + date.valueOf() + '.' + file.name.split('.').pop();
    const path = './tmp/' + file.name;
    await file.mv(path, function (err) {
        if (err) {
            return res.status(500).send({
                status: false,
                message: err.message
            });
        }
        res.status(200).send({
            status: true,
            message: '',
            data: { file_name: file.name }
        });
    });
}
