import React, { useEffect, useRef } from 'react';
import './Transition.css'
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = Math.floor(Math.random() * 40) + start;
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]; // Add this line
  
      if (this.frame >= end) {
        complete++;
        output += `<span class='fade-out'>${to}</span>`;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class='fade-in dud'>${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const Transition = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const phrases = ['  Top 4 dishes', 'トップ4の料理'];
    const el = textRef.current;
    const fx = new TextScramble(el);

    let counter = 0;
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 11800);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    
    <div>
      <div
        style={{
          fontFamily: 'Roboto Mono, monospace',
          background: '',
          height: '100%',
          
        }}
      >
        <div
          style={{
            fontWeight: 100,
            fontSize: '28px',
            color: 'grey',
          }}
          className="text-transition"
          ref={textRef}
        ></div>
      </div>
      {/* Add your login form here */}
    </div>
  );
};

export default Transition;
