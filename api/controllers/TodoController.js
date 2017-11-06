/**
 * TodoController
 *
 * @description :: Server-side logic for managing todoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index(req, res) {
    Todo.find(function (err, items) {
      if (err) {
        res.error(err);
      } else {
        Todo.subscribe(req.socket, items);
        res.json(items);
      }
    });
  },

  create(req, res) {
    var name = req.param('name');

    Todo.create({ name: name }, function (err, item) {
      if (err) {
        res.error(err);
      } else {
        Todo.subscribe(req.socket, item);
        res.json(item);
      }
    });
  },

  update(req, res) {
    var id = req.param('id');
    var checked = req.param('checked');

    Todo.update(id, { checked: checked }, function (err, item) {
      if (err) {
        res.error(err);
      } else {
        Todo.message(id, {
          type: 'itemUpdated',
          data: { item: item[0] }
        });
        res.json(item[0]);
      }
    });
  },

  destroy(req, res) {
    var id = req.param('id');

    Todo.destroy(id, function (err) {
      if (err) {
        res.error(err);
      } else {
        Todo.message(id, {
          type: 'itemDestroyed',
          data: { itemId: id }
        });
        res.send(200);
      }
    });
  }

};
