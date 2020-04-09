

exports.get_gather_page = (req, res) => {
    res.render('gather', { id: req.params.id , member: req.params.name });
};

exports.create_gathering = (req, res) => {
    res.render('gather-create', { id: req.params.id , member: req.params.name });
};

exports.join_gathering = (req, res) => {
    res.render('gather-join', {id: req.params.id ,  member: req.params.name });
};