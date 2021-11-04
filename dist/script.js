const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;

  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());

  return {
    cancel: cancel };

};

class TimerLengthControl extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "length-control" }, /*#__PURE__*/
      React.createElement("div", { id: this.props.titleID }, this.props.title), /*#__PURE__*/
      React.createElement("button", {
        className: "btn-level",
        id: this.props.minID,
        onClick: this.props.onClick,
        value: "-" }, /*#__PURE__*/

      React.createElement("i", { class: "fas fa-minus-circle fa-2x" })), /*#__PURE__*/

      React.createElement("div", { className: "btn-level", id: this.props.lengthID },
      this.props.length), /*#__PURE__*/

      React.createElement("button", {
        className: "btn-level",
        id: this.props.addID,
        onClick: this.props.onClick,
        value: "+" }, /*#__PURE__*/

      React.createElement("i", { class: "fas fa-plus-circle fa-2x" }))));



  }}


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" } };

    this.setBreakLength = this.setBreakLength.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clock = this.clock.bind(this);
    this.reset = this.reset.bind(this);
  }

  setBreakLength(e) {
    this.lengthControl(
    "breakLength",
    e.currentTarget.value,
    this.state.breakLength,
    "Session");

  }

  setSessionLength(e) {
    this.lengthControl(
    "sessionLength",
    e.currentTarget.value,
    this.state.sessionLength,
    "Break");

  }

  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === "running") {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1) {
        this.setState({
          [stateToChange]: currentLength - 1 });

      } else if (sign === "+" && currentLength !== 60) {
        this.setState({
          [stateToChange]: currentLength + 1 });

      }
    } else if (sign === "-" && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60 });

    } else if (sign === "+" && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60 });

    }
  }

  timerControl() {
    if (this.state.timerState === "stopped") {
      this.beginCountDown();
      this.setState({
        timerState: "running" });

    } else {
      this.setState({
        timerState: "stopped" });

      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  }

  beginCountDown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000) });

  }

  decrementTimer() {
    this.setState({
      timer: this.state.timer - 1 });

  }

  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === "Session") {
        this.beginCountDown();
        this.switchTimer(this.state.breakLength * 60, "Break");
      } else {
        this.beginCountDown();
        this.switchTimer(this.state.sessionLength * 60, "Session");
      }
    }
  }

  warning(_timer) {
    if (_timer < 61) {
      this.setState({
        alarmColor: {
          color: "#1173F2" } });


    } else {
      this.setState({
        alarmColor: {
          color: "white" } });


    }
  }

  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }

  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: {
        color: "white" } });


  }

  clock() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  reset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: {
        color: "white" } });



    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "main-title" }, "25 + 5 Clock"), /*#__PURE__*/
      React.createElement(TimerLengthControl, {
        addID: "break-increment",
        length: this.state.breakLength,
        lengthID: "break-length",
        minID: "break-decrement",
        onClick: this.setBreakLength,
        title: "Break Length",
        titleID: "break-label" }), /*#__PURE__*/

      React.createElement(TimerLengthControl, {
        addID: "session-increment",
        length: this.state.sessionLength,
        lengthID: "session-length",
        minID: "session-decrement",
        onClick: this.setSessionLength,
        title: "Session Length",
        titleID: "session-label" }), /*#__PURE__*/

      React.createElement("div", { className: "timer", style: this.state.alarmColor }, /*#__PURE__*/
      React.createElement("div", { className: "timer-wrapper" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-label" }, this.state.timerType), /*#__PURE__*/
      React.createElement("div", { id: "time-left" }, this.clock()))), /*#__PURE__*/


      React.createElement("div", { className: "timer-control" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.timerControl }, /*#__PURE__*/
      React.createElement("i", { className: "fas fa-play fa-2x" }), /*#__PURE__*/
      React.createElement("i", { className: "fas fa-pause fa-2x" })), /*#__PURE__*/

      React.createElement("button", { id: "reset", onClick: this.reset }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-sync-alt fa-2x" }))), /*#__PURE__*/


      React.createElement("audio", {
        id: "beep",
        preload: "auto",
        ref: audio => {
          this.audioBeep = audio;
        },
        src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Timer, null), document.getElementById("app"));