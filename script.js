const EMPTY = 'empty';
const CHARIOT_B = 'chariot_black';
const HORSE_B = 'horse_black';
const ELEPHANT_B = 'elephant_black';
const ADVISOR_B = 'advisor_black';
const GENERAL_B = 'general_black';
const CANNON_B = 'cannon_black';
const SOLDIER_B = 'soldier_black';
const CHARIOT_R = 'chariot_red';
const HORSE_R = 'horse_red';
const ELEPHANT_R = 'elephant_red';
const ADVISOR_R = 'advisor_red';
const GENERAL_R = 'general_red';
const CANNON_R = 'cannon_red';
const SOLDIER_R = 'soldier_red';
const PIECE_WIDTH = 75;
const PIECE_MARGIN = 7;
const PIECE_VERTICAL_PADDING = 72;
const PIECE_HORIZONTAL_PADDING = 72;
const INIT_BOARD = [
  [CHARIOT_B, HORSE_B, ELEPHANT_B, ADVISOR_B, GENERAL_B, ADVISOR_B, ELEPHANT_B, HORSE_B, CHARIOT_B],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, CANNON_B, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, CANNON_B, EMPTY],
  [SOLDIER_B, EMPTY, SOLDIER_B, EMPTY, SOLDIER_B, EMPTY, SOLDIER_B, EMPTY, SOLDIER_B],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [SOLDIER_R, EMPTY, SOLDIER_R, EMPTY, SOLDIER_R, EMPTY, SOLDIER_R, EMPTY, SOLDIER_R],
  [EMPTY, CANNON_R, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, CANNON_R, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [CHARIOT_R, HORSE_R, ELEPHANT_R, ADVISOR_R, GENERAL_R, ADVISOR_R, ELEPHANT_R, HORSE_R, CHARIOT_R]
];

var currentBoard;
var currentTurn;
var selected;
var record = [];

var placeBoard = function(ele, i, j, color, name) {
  i = parseInt(i);
  j = parseInt(j);
  ele.attr('row', i);
  ele.attr('col', j);
  ele.attr('color', color);
  ele.attr('name', name);
  ele.css('top', PIECE_HORIZONTAL_PADDING + i * (PIECE_WIDTH + PIECE_MARGIN));
  ele.css('left', PIECE_VERTICAL_PADDING + j * (PIECE_WIDTH + PIECE_MARGIN));
  if (name !== EMPTY) currentBoard[i][j] = name;
}
var win = function(color) {
  $('.win-modal').removeClass('red black').addClass(color);
  $('.win-modal').fadeIn();
  $('.cover').show();
}
var changeTurn = function(color) {
  currentTurn = color;
  $('.board').removeClass('red-turn black-turn').addClass(color + '-turn');
  $('.indicator-red').removeClass('selected');
  $('.indicator-black').removeClass('selected');
  $('.indicator-' + color).addClass('selected');
}
var isValidMove = function(selected, target) {
  var selectedX = parseInt(selected.attr('row'));
  var selectedY = parseInt(selected.attr('col'));
  var targetX = parseInt(target.attr('row'));
  var targetY = parseInt(target.attr('col'));
  var type = selected.attr('name').split('_')[0];
  if (type === 'soldier') {
    if (currentTurn === 'red') {
      if (targetX === selectedX - 1 && targetY === selectedY) return true;
      if (selectedX <= 4 && selectedX === targetX && Math.abs(targetY - selectedY) === 1) return true;
      return false;
    }
    else {
      if (targetX === selectedX + 1 && targetY === selectedY) return true;
      if (selectedX >= 5 && selectedX === targetX && Math.abs(targetY - selectedY) === 1) return true;
      return false;
    }
  }
  else if (type === 'general') {
    var step;
    if (currentTurn === 'red') {
      if (targetX < 7 || targetY < 3 || targetY > 5) return false;
      step = -1;
    }
    else {
      if (targetX > 2 || targetY < 3 || targetY > 5) return false;
      step = 1;
    }
    if (Math.abs(selectedX - targetX) + Math.abs(selectedY - targetY) !== 1) return false;
    while (targetX + step >= 0 && targetX + step <= 9 && currentBoard[targetX + step][targetY] === EMPTY) step += currentTurn === 'red' ? -1 : 1;
    if (targetX + step < 0 || targetX + step > 9) return true;
    if ((currentTurn === 'red' && currentBoard[targetX + step][targetY] === GENERAL_B) || (currentTurn === 'black' && currentBoard[targetX + step][targetY] === GENERAL_R)) return false;
    return true;
  }
  else if (type === 'advisor') {
    if (currentTurn === 'red') {
      if (targetX < 7 || targetY < 3 || targetY > 5) return false;
    }
    else {
      if (targetX > 2 || targetY < 3 || targetY > 5) return false;
    }
    if (Math.abs(selectedX - targetX) !== 1 || Math.abs(selectedY - targetY) !== 1) return false;
    return true;
  }
  else if (type === 'elephant') {
    if (currentTurn === 'red') {
      if (targetX < 5) return false;
    }
    else {
      if (targetX > 4) return false;
    }
    if (Math.abs(selectedX - targetX) !== 2 || Math.abs(selectedY - targetY) !== 2) return false;
    if (currentBoard[(selectedX + targetX)/2][(selectedY + targetY)/2] !== EMPTY) return false;
    return true;
  }
  else if (type === 'horse') {
    if (Math.abs(targetX - selectedX) === 1) {
      if (Math.abs(targetY - selectedY) !== 2) return false;
      if (targetY > selectedY && currentBoard[selectedX][selectedY + 1] !== EMPTY) return false;
      if (targetY < selectedY && currentBoard[selectedX][selectedY - 1] !== EMPTY) return false;
      return true;
    }
    if (Math.abs(targetY - selectedY) === 1) {
      if (Math.abs(targetX - selectedX) !== 2) return false;
      if (targetX > selectedX && currentBoard[selectedX + 1][selectedY] !== EMPTY) return false;
      if (targetX < selectedX && currentBoard[selectedX - 1][selectedY] !== EMPTY) return false;
      return true;
    }
    return false;
  }
  else if (type === 'chariot') {
    if (targetX !== selectedX && targetY !== selectedY) return false;
    if (targetX === selectedX) {
      if (targetY < selectedY) for (var i=targetY+1; i<selectedY; i++) if (currentBoard[targetX][i] !== EMPTY) return false;
      if (targetY > selectedY) for (var i=selectedY+1; i<targetY; i++) if (currentBoard[targetX][i] !== EMPTY) return false;
      return true;
    }
    else {
      if (targetX < selectedX) for (var i=targetX+1; i<selectedX; i++) if (currentBoard[i][targetY] !== EMPTY) return false;
      if (targetX > selectedX) for (var i=selectedX+1; i<targetX; i++) if (currentBoard[i][targetY] !== EMPTY) return false;
      return true;
    }
  }
  else if (type === 'cannon') {
    if (targetX !== selectedX && targetY !== selectedY) return false;
    if (currentBoard[targetX][targetY] === EMPTY) {
      if (targetX === selectedX) {
        if (targetY < selectedY) for (var i=targetY+1; i<selectedY; i++) if (currentBoard[targetX][i] !== EMPTY) return false;
        if (targetY > selectedY) for (var i=selectedY+1; i<targetY; i++) if (currentBoard[targetX][i] !== EMPTY) return false;
        return true;
      }
      else {
        if (targetX < selectedX) for (var i=targetX+1; i<selectedX; i++) if (currentBoard[i][targetY] !== EMPTY) return false;
        if (targetX > selectedX) for (var i=selectedX+1; i<targetX; i++) if (currentBoard[i][targetY] !== EMPTY) return false;
        return true;
      }
    }
    else {
      var count = 0;
      if (targetX === selectedX) {
        if (targetY < selectedY) for (var i=targetY+1; i<selectedY; i++) if (currentBoard[targetX][i] !== EMPTY) count += 1;
        if (targetY > selectedY) for (var i=selectedY+1; i<targetY; i++) if (currentBoard[targetX][i] !== EMPTY) count += 1;
        return count === 1;
      }
      else {
        if (targetX < selectedX) for (var i=targetX+1; i<selectedX; i++) if (currentBoard[i][targetY] !== EMPTY) count += 1;
        if (targetX > selectedX) for (var i=selectedX+1; i<targetX; i++) if (currentBoard[i][targetY] !== EMPTY) count += 1;
        return count === 1;
      }
    }
  }
};
var isGeneralValid = function(selected, target) {
  var selectedX = parseInt(selected.attr('row'));
  var selectedY = parseInt(selected.attr('col'));
  var targetX = parseInt(target.attr('row'));
  var targetY = parseInt(target.attr('col'));
  var generalRedX = parseInt($('.board').find('.general.red').attr('row'));
  var generalRedY = parseInt($('.board').find('.general.red').attr('col'));
  var generalBlackX = parseInt($('.board').find('.general.black').attr('row'));
  var generalBlackY = parseInt($('.board').find('.general.black').attr('col'));
  if (generalRedY !== generalBlackY) return true;
  if (selectedY !== generalRedY) return true;
  if (targetY === generalRedY && targetX > generalBlackX && targetX < generalRedX) return true;
  for (var i=generalBlackX+1; i<generalRedX; i++) {
  	if (i === selectedX) continue;
  	if (currentBoard[i][generalRedY] !== EMPTY) return true;
  }
  return false;
}
var readBoard = function(board) {
  $('.cover').fadeOut();
  $('.win-modal').hide();
  $('.board').empty();
  for (var i=0; i<board.length; i++) {
    for (var j=0; j<board[i].length; j++) {
      if (board[i][j] !== EMPTY) {
        var name = board[i][j].split('_')[0];
        var color = board[i][j].split('_')[1];
        var ele = $('<div class="chess-piece' + ' ' + name + ' ' + color + '"></div>');
        $('.board').append(ele);
        placeBoard(ele, i, j, color, board[i][j]);
      }
      var ele = $('<div class="chess-piece empty"></div>');
      $('.board').append(ele);
      placeBoard(ele, i, j, 'empty', EMPTY);
    }
  }
  $('.chess-piece').off('click').on('click', function() {
    if ((selected !== false && currentTurn === $(this).attr('color')) || selected === false) {
      if ($(this).hasClass('empty')) return;
      if ($('.board').hasClass('black-turn') && $(this).hasClass('red')) return;
      if ($('.board').hasClass('red-turn') && $(this).hasClass('black')) return;
      $('.chess-piece').removeClass('selected');
      $(this).addClass('selected');
      selected = $(this);
    }
    else {
      if (isValidMove(selected, $(this)) && isGeneralValid(selected, $(this))) {
      	record.push([deepCloneBoard(currentBoard), currentTurn]);
        if (!$(this).hasClass('empty')) {
          if ($(this).hasClass('general')) {
          	if ($(this).hasClass('red')) win('black');
          	else win('red')
          }
          $(this).remove();
        }
        currentBoard[parseInt(selected.attr('row'))][parseInt(selected.attr('col'))] = EMPTY;
        placeBoard(selected, $(this).attr('row'), $(this).attr('col'), currentTurn, selected.attr('name'));
        if (currentTurn === 'red') changeTurn('black');
        else changeTurn('red');
        selected = false;
        $('.chess-piece').removeClass('selected');
      }
    }
    //console.log(board);
  });
};

var deepCloneBoard = function(board) {
  var ret = [];
  for (var i=0; i<board.length; i++) ret.push(board[i].slice());
  return ret;
};
var restartGame = function(board, turn) {
  readBoard(board);
  changeTurn(turn);
  $('.chess-piece').removeClass('selected');
  selected = false;
}
var undo = function() {
  if (record.length === 0) return;
  var element = record.pop();
  currentBoard = deepCloneBoard(element[0]);
  restartGame(currentBoard, element[1]);
};
$('.restart').off('click').on('click', function() {
  record = [];
  currentBoard = deepCloneBoard(INIT_BOARD);
  restartGame(deepCloneBoard(INIT_BOARD), 'red');
});
$('.undo').off('click').on('click', function() {
  undo();
});
currentBoard = deepCloneBoard(INIT_BOARD);
restartGame(currentBoard, 'red');
