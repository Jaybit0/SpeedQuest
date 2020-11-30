class TempView {
  constructor(id, time, fill) {
    this.baseItem = document.querySelector(id);
    this.time = time;
    this.fill = fill;
    this.hide();
  }

  display(info){
    var view = $(this.baseItem);
    this.fill(view, info);
    this.show();
    console.log(this.time);
    this.timer = setTimeout(() => {
      this.hide();
    }, this.time);
  }

  hide(){
    $(this.baseItem).hide();
    this.timer = null;
  }

  show(){
    $(this.baseItem).show();
    if(this.timer != null)
      clearTimeout(this.timer);
  }
}
