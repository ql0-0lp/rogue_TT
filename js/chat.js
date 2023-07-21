function Chat() {
    this.list  = []
}

Chat.prototype.addNote = function (text) {
    this.list.push(text)
    this.chatDraw()
}

Chat.prototype.chatDraw = function () {
    var fieldElement = document.querySelector('.game-chat');
    fieldElement.innerHTML = '';
    //Тут используется обратный ход, потому что в стилях инвертированные отображение (чтобы чат шел снизу вверх)
    for (var i = this.list.length - 1; i >= 0 ; i--) {
        var tileElement = document.createElement('p');
        tileElement.textContent = this.list[i];
        fieldElement.appendChild(tileElement);
    }
}