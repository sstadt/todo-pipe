
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
    var checked = !$btn.hasClass('checked');

    io.socket.post(`/todo/${id}`, { checked: checked }, function (response) {
      var $item = $itemList.find(`[data-id="${id}"]`);
      response.checked === true ? $item.addClass('checked') : $item.removeClass('checked');
    });
  });
})(window.jQuery, window.io);
