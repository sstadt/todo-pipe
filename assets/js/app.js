
(function ($, io) {
  var $itemName = $('#item_name');
  var $itemList = $('.js-item-list');
  var $addItemForm = $('.js-add-item');

  // add a new item to the DOM
  function addItemToDOM(item) {
    var itemClass = item.checked ? 'class="checked"' : '';
    $itemList.append(`<li><a href="#" ${itemClass} data-id="${item.id}">${item.name}</a></li>`);
  }

  // update an existing item
  function itemUpdated(data) {
    var $item = $itemList.find(`[data-id="${data.item.id}"]`);
    if (data.item.checked === true) $item.addClass('checked');
  }

  // remove an existing item
  function itemDestroyed(data) {
    $itemList.find(`[data-id="${data.itemId}"]`).closest('li').remove();
  }

  // fetch existing items
  io.socket.get('/todo', function (response) {
    response.forEach((item) => addItemToDOM(item));
  });

  // add item form handler
  $addItemForm.submit(function (event) {
    event.preventDefault();

    var newItem = $itemName.val();

    io.socket.post('/todo/create', { name: newItem, checked: false }, function (response) {
      addItemToDOM(response);
      $itemName.val('');
    });
  });

  // update item handler
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

  // handle socket notifications
  var todoPipe = new Pipe('todo');
  todoPipe.on('itemUpdated', itemUpdated);
  todoPipe.on('itemDestroyed', itemDestroyed);
})(window.jQuery, window.io);
