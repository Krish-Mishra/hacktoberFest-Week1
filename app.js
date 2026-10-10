import { generateMission } from './ai-service.js';

// DOM Elements
const states = {
  config: document.getElementById('state-config'),
  mission: document.getElementById('state-mission'),
  zen: document.getElementById('state-zen'),
  reflection: document.getElementById('state-reflection')
};

const configForm = document.getElementById('config-form');
const loadingSection = document.getElementById('loading');
const missionContent = document.getElementById('mission-content');
const errorMessage = document.getElementById('error-message');

const missionTitle = document.getElementById('mission-title');
const missionDesc = document.getElementById('mission-description');
const missionSteps = document.getElementById('mission-steps');

const btnStartZen = document.getElementById('btn-start-zen');
const btnBackConfig = document.getElementById('btn-back-config');
const btnRetry = document.getElementById('btn-retry');
const btnGiveUp = document.getElementById('btn-give-up');
const btnReset = document.getElementById('btn-reset');
const countdownEl = document.getElementById('countdown');

// App State
let selectedTime = 0;
let countdownInterval = null;
let currentMissionData = null;

// Helpers
const switchState = (newStateId) => {
  Object.values(states).forEach(el => el.classList.remove('active'));
  states[newStateId].classList.add('active');
  
  if (newStateId === 'zen') {
    document.body.classList.add('zen-active');
  } else {
    document.body.classList.remove('zen-active');
  }
};

const playChime = () => {
  // Simple beep using AudioContext
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.warn("Audio not supported or allowed", e);
  }
};

// Timer Logic
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const startTimer = (minutes) => {
  let timeLeft = minutes * 60;
  countdownEl.textContent = formatTime(timeLeft);
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = formatTime(timeLeft);
    
    if (timeLeft <= 0) {
      endZenMode();
    }
  }, 1000);
};

const endZenMode = () => {
  clearInterval(countdownInterval);
  playChime();
  switchState('reflection');
};

// Event Listeners
configForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const env = document.getElementById('environment').value;
  selectedTime = parseInt(document.getElementById('time').value, 10);
  const vibe = document.getElementById('vibe').value;
  
  switchState('mission');
  loadingSection.classList.remove('hidden');
  missionContent.classList.add('hidden');
  errorMessage.classList.add('hidden');
  
  try {
    currentMissionData = await generateMission(env, selectedTime, vibe);
    
    missionTitle.textContent = currentMissionData.title;
    missionDesc.textContent = currentMissionData.description;
    missionSteps.innerHTML = currentMissionData.steps.map(step => `<li>${step}</li>`).join('');
    
    loadingSection.classList.add('hidden');
    missionContent.classList.remove('hidden');
  } catch (error) {
    console.error("Failed to generate mission:", error);
    loadingSection.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
});

btnBackConfig.addEventListener('click', () => switchState('config'));
btnRetry.addEventListener('click', () => configForm.dispatchEvent(new Event('submit')));

btnStartZen.addEventListener('click', () => {
  switchState('zen');
  startTimer(selectedTime);
});

btnGiveUp.addEventListener('click', endZenMode);

btnReset.addEventListener('click', () => {
  document.getElementById('reflection-text').value = '';
  switchState('config');
});

// Init
switchState('config');
