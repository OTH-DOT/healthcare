import { io } from '../sockets/socket.js'; // import your socket instance

// Function to simulate ECG signal for 12 leads
const generateECGData = () => {
  const timestamp = Date.now();

  // Simulate realistic ECG values for each lead (in mV)
  const leads = {
    I: +(Math.random() * 0.3 - 0.15).toFixed(2),
    II: +(Math.random() * 0.3 - 0.15).toFixed(2),
    III: +(Math.random() * 0.3 - 0.15).toFixed(2),
    aVR: +(Math.random() * 0.3 - 0.15).toFixed(2),
    aVL: +(Math.random() * 0.3 - 0.15).toFixed(2),
    aVF: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V1: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V2: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V3: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V4: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V5: +(Math.random() * 0.3 - 0.15).toFixed(2),
    V6: +(Math.random() * 0.3 - 0.15).toFixed(2),
  };

  return { timestamp, leads };
};

export const startECGSimulation = () => {
  setInterval(() => {
    const data = generateECGData();
    io.emit('ecgUpdate', data); // emit to all clients
  }, 250); // every 250ms (4Hz)
};
