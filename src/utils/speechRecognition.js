// utils/speechRecognition.js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const getSpeechRecognition = () => {
  if (!SpeechRecognition) {
console.warn("Tu navegador no soporta reconocimiento de voz.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-AR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  return recognition;
};
