import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    // В state храним 3 переменные, степ - число, xIsNext - кто ходит следующий и history - массив обьектов squares - который в себе хранит массив строк
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handelClick(i) {
    // возвращаем новый массив ходов
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // получаем текущий ход
    const current = history[history.length - 1];
    // получаем копию массива ходов
    const squares = current.squares.slice();
    // проверям а был ли победитель и ячейку на заполненость если условия не выполняеться то ничего не делаем
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // подготавливаем массив ходов с текущим ходом
    squares[i] = getNext(this.state.xIsNext);
    // обновляем состояние
    this.setState({
      // пушим новый ход в историю
      history: history.concat([{
        squares: squares,
      }]),
      // обновляем счетчик ходов
      stepNumber: history.length,
      // инвертируем игрока
      xIsNext: !this.state.xIsNext,
    });
  }

  // функция для смены состояния на нужный ход
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // вычисляем какой игрок ходит
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // получаем истоию ходов
    const history = this.state.history;
    // получаем текущий ход
    const squares = history[this.state.stepNumber].squares;
    // проверяем есть ли победитель
    let winner = calculateWinner(squares);
    // текст для статуса
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + getNext(this.state.xIsNext);
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handelClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// class Square extends React.Component {

//   render() {
//     // Если в он клик передать стрелочную функцию она привяжеться к контексту но если явно передать функцию она будет пытатся получить контекст в месте вызова
//     // Поэтому в он клик нужно передать функцию с bind (явно привязать контекст вызова) или стрелочную функцию где она явно привязывает контекст
//     // (function() {this.setState({value: 'X'})}).bind(this) можно явно передать контекст
//     return (
//       <button className="square" 
//         onClick={()=>this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function getNext(bool) {
  return bool ? 'X' : 'O';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Example() {
  // Объявляем новую переменную состояния "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Вы нажали {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми на меня
      </button>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <Game />
    <Example />
  </div>
);
