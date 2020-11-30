class ListManager {

  constructor(id, template, fill, ident) {
      this.baseItem = document.querySelector(id);
      this.templateItem = document.querySelector(template);
      this.fill = fill;
      this.ident = ident;
  }

  add(items){
    for (var i = 0; i < items.length; i++) {
  		this.addSingle(items[i]);
  	}
  }

  addSingle(item){
    var itemClone = document.importNode(this.templateItem.content, true);
    this.fill(itemClone, item);
    $(itemClone.firstElementChild).attr('id', this.ident(item))
    $(this.baseItem).append(itemClone);
  }

  update(items){
    for (var i = 0; i < items.length; i++) {
  		this.updateSingle(items[i]);
  	}
  }

  updateSingle(item){
    var found = false;
  	for (var i = 0; i < $(this.baseItem).children().length; i++) {
  		var listItem = $(this.baseItem).children()[i];
  		if ($(listItem).attr('id') == this.ident(item)) {
        this.fill(listItem, item);
        found = true;
  			break;
  		}
  	}
    if(!found)
      this.addSingle(item);
  }

  remove(item){
  	for (var i = 0; i < $(this.baseItem).children().length; i++) {
  		var listItem = $(this.baseItem).children()[i];
  		if ($(listItem).attr('id') == this.ident(item)) {
        listItem.remove();
  			break;
  		}
  	}

  }
}
