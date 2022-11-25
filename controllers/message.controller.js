
const { Message } = require('../models/index');

exports.getConversation = async (req, res) => {
    const { id_user1, id_user2 } = req.query;
    const messenger = await Message.findOne({
        where: {
            userId1: id_user1,
            userId2: id_user2
        }
    });
    if (!messenger) {
        return res.status(200).json({
            status: false,
            message: 'Not found',
            data: {}
        });
    }
    res.status(200).send({
        status: true,
        message: 'success',
        data: messenger
    });
}

exports.send = async (req, res) => {
    const { id_user1, id_user2, id, message, name, category } = req.body;
    const data = {
        id: id,
        message: message,
        name: name,
        category: category,
    }
    const messenger = await Message.findOne({ where: { userId1: id_user1, userId2: id_user2 } });
    if (!messenger) {
        await Message.create({
            userId1: id_user1,
            userId2: id_user2,
            content: [data]
        });
        return res.status(200).send({
            status: true,
            message: 'success'
        });
    }
    messenger.content.push(data)
    await Message.update({
        content: messenger.content
    }, {
        where: { userId1: id_user1, userId2: id_user2 }
    })
    res.status(200).send({
        status: true,
        message: 'success'
    });
}