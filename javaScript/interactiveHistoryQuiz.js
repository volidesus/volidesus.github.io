function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//Create questions
const questions = {
  1: "When did WWII start?",
  2: "Who was the first president of the United States?",
  3: "What started WWI?",
  4: "Why did the French Revolution happen?",
  5: "What was the first tank used in combat?",
  6: "What happened during the Russian Revolution?",
  7: "When was the berlin wall torn down?",
  8: "Why was the Battle of Normandy so important?",
  9: "Which treaty officially ended WWI?",
  10: "Which group of nation is member of the Axis"};
const options = ["1939", "1941", "1918", "1945",
  "George W. Bush", "George Washington", "George Bush", "George Washington Jr.",
  "Germany's Invasion of Poland", "Assasination of Archduke Franz Ferdinand", "German's Millitary Agression", "Germany's Attack on Belgium",
  "British Invasion of France", "The killing of French Royalty", "Extravagant Lifestyle of French Monarchy", "Drought",
  "British Mark I", "German Panzer I", "French Schneider CA1", "British Churchill Tank",
  "A military coup", "A peacefull protest of the Tsarist monarchy", "Widespread public support for the monarchy", "The overthrow of the Tsarist monarchy",
  "1945", "1961", "1989", "1991",
  "Because it marked the end of World War II", "Because it was a turning point for the Axis", "Because it opened the gates to communism", "Because it opened western europe for the Allies",
  "Treaty of Paris", "Treaty of Versailles", "Treaty of Sèvres", "Treaty of Düsseldorf",
  "Germany, Russia, China", "Italy, Germany, Russia", "Japan, Germany, Italy", "Japan, Spain, Italy"];
const answers = {1: "1939", 2: "George Washington", 
  3: "Assasination of Archduke Franz Ferdinand", 4: "Extravagant Lifestyle of French Monarchy",
  5: "British Mark I", 6: "The overthrow of the Tsarist monarchy",
  7: "1989", 8: "Because it opened western europe for the Allies",
  9: "Treaty of Versailles", 10: "Japan, Germany, Italy"};

// Randomize the order of questions
const shuffledOrder = shuffle(Object.keys(questions));
let currentQuestion = 1;
let currentOrder = shuffledOrder[currentQuestion - 1];
let correctAnswers = 0;

// Fading an element
function lerp(a,b,u) {
    return (1-u) * a + u * b;
};

function fade(element, property, start, end, duration) {
  var interval = 10;
  var steps = duration/interval;
  var step_u = 1.0/steps;
  var u = 0.0;
  var theInterval = setInterval(function(){
    if (u >= 1.0){ clearInterval(theInterval) }
    var r = parseInt(lerp(start.r, end.r, u));
    var g = parseInt(lerp(start.g, end.g, u));
    var b = parseInt(lerp(start.b, end.b, u));
    var colorname = 'rgb('+r+','+g+','+b+')';
    el.style.setProperty(property, colorname);
    u += step_u;
  }, interval);
};

let el = document.querySelector('body');
let property = 'background-color';
let endColor = {r: 14, g: 25, b: 71};
let startColor = {r: 29, g: 11, b: 10};

// Start the timer
const timer = document.querySelector('#timer');
let startDate;

function startTimer() {
  startDate = new Date();
  updateTimer();
}

// Update the timer
function updateTimer() {
  const currentDate = new Date();
  const elapsedTime = currentDate - startDate;

  // Calculate hours, minutes, and seconds
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  // Format digits with leading zeros
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  // Display the timer on the page
  timer.innerHTML = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Grade upon finishing
function createGrade() {
  const form = document.querySelector('form');
  form.remove();

  const percentRight = String(Math.round(correctAnswers / Object.keys(questions).length * 100));
  document.querySelector('h2').innerHTML = "Congratulations on getting <br>" + percentRight + "% right in " + timer.innerHTML + "!<br><br>" + "You can try again by <a href='javascript:window.top.location.reload(true)'>clicking here</a>";
  timer.style.display = 'none';
}

// Checking your answer and changing the question
function changeQuestion() {
  document.getElementById('question').innerHTML = currentQuestion + ". " + questions[currentOrder];
  document.getElementById('a_text').innerHTML = options[currentOrder * 4 - 4];
  document.getElementById('b_text').innerHTML = options[currentOrder * 4 - 3];
  document.getElementById('c_text').innerHTML = options[currentOrder * 4 - 2];
  document.getElementById('d_text').innerHTML = options[currentOrder * 4 - 1];
}

function submitAnswer() {
  const selectedAnswer = options[currentOrder * 4 - parseInt(document.querySelector('input[name="answer"]:checked').value)];
  if (selectedAnswer == answers[currentOrder]) {
    correctAnswers++;
  } else {
    fade(el, 'background-color', startColor, endColor, 800)
  }
  if (currentQuestion != Object.keys(questions).length) {
    currentQuestion++;
    currentOrder = shuffledOrder[currentQuestion - 1];
    changeQuestion();
    event.preventDefault();
  } else {
    createGrade();
  }
}

// Do the required function
changeQuestion();
startTimer();
setInterval(updateTimer, 1000);