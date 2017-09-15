var TIMEOUT_IN_SECS = 3 * 60
var ALERT_MESSAGES_SECS_TIMEOUT = 30
var TEMPLATE = '<h1 style = "border: 6px solid rgba(0,0,0,0.3);"><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>'
var MESSAGES = ['«Всякий неработающий человек — негодяй» \n Жан-Жак Руссо',
  '«Жить — значит работать. Труд есть жизнь человека» \n Вольтер',
  '«Любовь и работа - единственные стоящие вещи в жизни. Работа - это своеобразная форма любви» \n Мэрилин Монро',
  '«Отдых сердца лучше всего обеспечивает работа ума» \n Гастон Левис',
  '«Работа избавляет нас от трех великих зол: скуки, порока, нужды» \n Вольтер',
  '«Работа — мое первое наслаждение» \n Вольфганг Моцарт',
  '«Я твердо верю в удачу, и я заметил: чем больше я работаю, тем я удачливее» \n Томас Джефферсон',
  '«Вдохновение приходит только во время работы» \n Габриэль Маркес',
  '«Понуждай сам свою работу; не жди, чтобы она тебя понуждала» \n Бенджамин Франклин',
  '«Единственное спасение в душевном горе — это работа» \n Петр Чайковский',
  '«Чтобы победить самые тяжелые страдания, есть два средства: это опиум и работа» \n Генрих Гейне',
  '«Унция репутации стоит фунта работы» \n Лоренс Питер',
  '«Обычно те, кто лучше других умеет работать, лучше других умеют не работать» \n Жорж Элгози'];

function padZero(number){
  return ("00" + String(number)).slice(-2);
}

class Timer{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs){
    this.isRunning = false
    this.timestampOnStart = null
    this.initial_timeout_in_secs = timeout_in_secs
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
  getTimestampInSecs(){
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds/1000)
  }
  start(){
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }
  stop(){
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }
  calculateSecsLeft(){
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
  updateTimer(timeout_in_secs){
    this.initial_timeout_in_secs = timeout_in_secs
    this.timestampOnStart = this.getTimestampInSecs()
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
}

class TimerWidget{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct(){
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
  mount(rootTag){
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')
    var style = "margin-top: 25px; margin-left: 5px; position: fixed; height: 15px; z-index: 21; font-size: smaller;"
    this.timerContainer.setAttribute("style", style)
    this.timerContainer.innerHTML = TEMPLATE

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }
  update(secsLeft){
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)
  }
  unmount(){
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}


function main(){

  var timer = new Timer(TIMEOUT_IN_SECS)
  var timerWiget = new TimerWidget()
  var intervalId = null

  timerWiget.mount(document.body)


  function getMessage(){
     return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  }

  function handleIntervalTick(){
    var secsLeft = timer.calculateSecsLeft()
    timerWiget.update(secsLeft)
    if (secsLeft <= 0){
        alert(getMessage());
        timer.updateTimer(ALERT_MESSAGES_SECS_TIMEOUT)
    }
  }

  function handleVisibilityChange(){
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}

// initialize timer when page ready for presentation
window.addEventListener('load', main)
