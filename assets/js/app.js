
(function ($, io) {
  var $itemName = $('#item_name');
  var $itemList = $('.js-item-list');
  var $addItemForm = $('.js-add-item');

  function addItemToDOM(item) {
    var itemClass = item.checked ? 'class="checked"' : '';
    $itemList.append(`<li><a href="#" ${itemClass} data-id="${item.id}">${item.name}</a></li>`);
  }

  // fetch existing items
  io.socket.get('/todo', function (response) {
    response.forEach((item) => addItemToDOM(item));
  });

  // add item
  $addItemForm.submit(function (event) {
    event.preventDefault();

    var newItem = $itemName.val();

    io.socket.post('/todo/create', { name: newItem, checked: false }, function (response) {
      addItemToDOM(response);
      $itemName.val('');
    });
  });

  // update item
  $itemList.on('click', 'a', function (event) {
    event.preventDefault();

    var $btn = $(event.currentTarget);
    var id = $btn.data('id');
    var checked = $btn.hasClass('checked');

    if (checked) {
      io.socket.post(`/todo/destroy`, { id });
    } else {
      io.socket.post(`/todo/update`, { id: id, checked: true });
    }
  });

  function itemUpdated(item) {
    var $item = $itemList.find(`[data-id="${item.id}"]`);
    if (item.checked === true) $item.addClass('checked');
  }

  function itemDestroyed(id) {
    $itemList.find(`[data-id="${id}"]`).closest('li').remove();
  }

  // notifications
  io.socket.on('todo', function (message) {
    if (message.data.type === 'itemUpdated') {
      itemUpdated(message.data.data.item);
    } else if (message.data.type === 'itemDestroyed') {
      itemDestroyed(message.data.data.itemId);
    }
  });
})(window.jQuery, window.io);
