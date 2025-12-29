const ping = (_, res) => {
    res.send({
        status: 'ok',
    });
};

module.exports = { ping };
