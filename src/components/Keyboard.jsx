import '../styles/Keyboard.css'

function Keyboard() {
  return (
    <div id="keyboard" className="keyboard hidden">
      <div id="row1" className="row">
        <span id="`" className="dual-key">
          <span>~</span>
          <span>`</span>
        </span>
        <span id="1" className="dual-key">
          <span>!</span>
          <span>1</span>
        </span>
        <span id="2" className="dual-key">
          <span>@</span>
          <span>2</span>
        </span>
        <span id="3" className="dual-key">
          <span>#</span>
          <span>3</span>
        </span>
        <span id="4" className="dual-key">
          <span>$</span>
          <span>4</span>
        </span>
        <span id="5" className="dual-key">
          <span>%</span>
          <span>5</span>
        </span>
        <span id="6" className="dual-key">
          <span>^</span>
          <span>6</span>
        </span>
        <span id="7" className="dual-key">
          <span>&</span>
          <span>7</span>
        </span>
        <span id="8" className="dual-key">
          <span>*</span>
          <span>8</span>
        </span>
        <span id="9" className="dual-key">
          <span>(</span>
          <span>9</span>
        </span>
        <span id="0" className="dual-key">
          <span>)</span>
          <span>0</span>
        </span>
        <span id="-" className="dual-key">
          <span>_</span>
          <span>-</span>
        </span>
        <span id="=" className="dual-key">
          <span>+</span>
          <span>=</span>
        </span>
        <span id="delete" className="rectangle-sm">Delete</span>
      </div>

      <div id="row2" className="row">
        <span id="tab" className="rectangle-sm">Tab</span>
        <span id="q" className="single-key">Q</span>
        <span id="w" className="single-key">W</span>
        <span id="e" className="single-key">E</span>
        <span id="r" className="single-key">R</span>
        <span id="t" className="single-key">T</span>
        <span id="y" className="single-key">Y</span>
        <span id="u" className="single-key">U</span>
        <span id="i" className="single-key">I</span>
        <span id="o" className="single-key">O</span>
        <span id="p" className="single-key">P</span>
        <span id="[" className="dual-key">
          <span>{'{'}</span>
          <span>[</span>
        </span>
        <span id="]" className="dual-key">
          <span>{'}'}</span>
          <span>]</span>
        </span>
        <span id="\" className="dual-key">
          <span>|</span>
          <span>\</span>
        </span>
      </div>

      <div id="row3" className="row">
        <span id="capsLock" className="rectangle-med">CapsLock</span>
        <span id="a" className="single-key">A</span>
        <span id="s" className="single-key">S</span>
        <span id="d" className="single-key">D</span>
        <span id="f" className="single-key">F</span>
        <span id="g" className="single-key">G</span>
        <span id="h" className="single-key">H</span>
        <span id="j" className="single-key">J</span>
        <span id="k" className="single-key">K</span>
        <span id="l" className="single-key">L</span>
        <span id=";" className="dual-key">
          <span>:</span>
          <span>;</span>
        </span>
        <span id="'" className="dual-key">
          <span>"</span>
          <span>'</span>
        </span>
        <span id="enter" className="rectangle-med">Enter</span>
      </div>

      <div id="row4" className="row">
        <span id="shiftLeft" className="rectangle-lg">Shift</span>
        <span id="z" className="single-key">Z</span>
        <span id="x" className="single-key">X</span>
        <span id="c" className="single-key">C</span>
        <span id="v" className="single-key">V</span>
        <span id="b" className="single-key">B</span>
        <span id="n" className="single-key">N</span>
        <span id="m" className="single-key">M</span>
        <span id="," className="dual-key">
          <span>&lt;</span>
          <span>,</span>
        </span>
        <span id="." className="dual-key">
          <span>&gt;</span>
          <span>.</span>
        </span>
        <span id="/" className="dual-key">
          <span>?</span>
          <span>/</span>
        </span>
        <span id="shiftRight" className="rectangle-lg">Shift</span>
      </div>

      <div id="row5" className="row">
        <span id="controlLeft" className="rectangle-med">Control</span>
        <span id="optLeft" className="rectangle-sm">Opt</span>
        <span id="cmdLeft" className="rectangle-med">Cmd</span>
        <span id="space" className="rectangle-x-lg">Space</span>
        <span id="cmdRight" className="rectangle-med">Cmd</span>
        <span id="optRight" className="rectangle-sm">Opt</span>
        <span id="controlRight" className="rectangle-med">Control</span>
      </div>

      <div className="hands">
        <div className="left-hand">
          <div id="finger-l5" className="finger finger-5"></div>
          <div id="finger-l4" className="finger finger-4"></div>
          <div id="finger-l3" className="finger finger-3"></div>
          <div id="finger-l2" className="finger finger-2"></div>
          <div id="finger-l1" className="finger finger-1"></div>
        </div>
        <div className="right-hand">
          <div id="finger-r1" className="finger finger-1"></div>
          <div id="finger-r2" className="finger finger-2"></div>
          <div id="finger-r3" className="finger finger-3"></div>
          <div id="finger-r4" className="finger finger-4"></div>
          <div id="finger-r5" className="finger finger-5"></div>
        </div>
      </div>
    </div>
  )
}

export default Keyboard
