import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ECGRealtime = () => {
  const [ecgData, setEcgData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [patientInfo] = useState({
    name: 'SUPTECH SANTE',
    gender: 'M',
    age: 55
  });
  const [settings] = useState({
    gains: 10,
    highOut: '150Hz',
    lowOut: '0.15Hz',
    hum: '60Hz',
    pace: 'ON'
  });
  const [heartRate, setHeartRate] = useState(75);
  const socketRef = useRef(null);
  const dataBufferRef = useRef({});
  
  // Buffer size for each lead (showing last 100 points)
  const BUFFER_SIZE = 100;
  
  // Lead names in standard ECG order
  const LEAD_NAMES = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  
  // Colors for each lead
  const LEAD_COLORS = {
    'I': '#e74c3c', 'II': '#3498db', 'III': '#2ecc71',
    'aVR': '#f39c12', 'aVL': '#9b59b6', 'aVF': '#1abc9c',
    'V1': '#e67e22', 'V2': '#34495e', 'V3': '#95a5a6',
    'V4': '#c0392b', 'V5': '#8e44ad', 'V6': '#16a085'
  };

  // Initialize data buffers for all leads
  useEffect(() => {
    const initialBuffer = {};
    LEAD_NAMES.forEach(lead => {
      initialBuffer[lead] = [];
    });
    dataBufferRef.current = initialBuffer;
    setEcgData(initialBuffer);
  }, []);

  // Heart rate variability simulation
  useEffect(() => {
    let hrInterval;
    
    if (isConnected) {
      hrInterval = setInterval(() => {
        // Simulate natural heart rate variability (±5 bpm)
        const variability = Math.floor(Math.random() * 11) - 5; // -5 to +5
        setHeartRate(prev => {
          const newRate = prev + variability;
          // Keep within reasonable bounds (50-120 bpm)
          return Math.min(Math.max(newRate, 50), 120);
        });
      }, 5000); // Change every 5 seconds
    }
    
    return () => clearInterval(hrInterval);
  }, [isConnected]);

  // Socket connection and data handling
  useEffect(() => {
    // Simulate socket connection
    const connectSocket = () => {
      setIsConnected(true);
      
      // Simulate receiving ECG data
      const interval = setInterval(() => {
        const mockData = generateRealisticECGData();
        handleECGUpdate(mockData);
      }, 40); // 25Hz sampling rate for smoother display
      
      return () => clearInterval(interval);
    };
    
    const cleanup = connectSocket();
    
    return cleanup;
  }, [heartRate]);

  // Generate realistic ECG data with proper waveforms for each lead
  const generateRealisticECGData = () => {
    const timestamp = Date.now();
    const leads = {};
    
    // Base time in seconds for waveform generation
    const time = timestamp / 1000;
    
    // Calculate current heart rate in Hz
    const baseFreq = heartRate / 60;
    
    // Generate a consistent phase for all leads
    const phase = time * baseFreq * 2 * Math.PI;
    
    LEAD_NAMES.forEach(lead => {
      // Generate realistic ECG waveform with P, QRS, and T components
      // Each lead has slightly different characteristics
      const noise = (Math.random() - 0.5) * 0.05;
      let pWave, qrsComplex, tWave, value;
      
      // Different leads have different typical waveforms
      switch(lead) {
        case 'I':
          pWave = 0.1 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.5 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.2 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'II':
          pWave = 0.15 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.8 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.3 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'III':
          pWave = 0.1 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.6 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.25 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'aVR':
          pWave = -0.08 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = -0.4 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = -0.15 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'aVL':
          pWave = 0.05 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.3 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.1 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'aVF':
          pWave = 0.12 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.7 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.25 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V1':
          pWave = 0.05 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.2 * Math.sin(phase + Math.PI) * Math.exp(-Math.pow(12*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.3 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V2':
          pWave = 0.06 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.4 * Math.sin(phase + Math.PI) * Math.exp(-Math.pow(12*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.4 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V3':
          pWave = 0.07 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.6 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.35 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V4':
          pWave = 0.08 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.7 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.3 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V5':
          pWave = 0.09 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.75 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.25 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        case 'V6':
          pWave = 0.1 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.8 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.2 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
          break;
          
        default:
          pWave = 0.1 * Math.sin(phase - Math.PI/2) * Math.exp(-Math.pow(4*((phase/(2*Math.PI)) % 1 - 0.15), 2));
          qrsComplex = 0.5 * Math.sin(phase) * Math.exp(-Math.pow(10*((phase/(2*Math.PI)) % 1 - 0.35), 2));
          tWave = 0.2 * Math.sin(phase + Math.PI/2) * Math.exp(-Math.pow(6*((phase/(2*Math.PI)) % 1 - 0.6), 2));
          value = pWave + qrsComplex + tWave + noise;
      }
      
      leads[lead] = parseFloat(value.toFixed(3));
    });
    
    return { timestamp, leads };
  };

  // Handle incoming ECG data
  const handleECGUpdate = (data) => {
    const newBuffers = { ...dataBufferRef.current };
    
    LEAD_NAMES.forEach(lead => {
      const leadValue = data.leads[lead];
      const newPoint = {
        timestamp: data.timestamp,
        time: new Date(data.timestamp).toLocaleTimeString(),
        value: leadValue,
        // Create a simple index for x-axis to avoid time formatting issues
        index: (newBuffers[lead]?.length || 0) % BUFFER_SIZE
      };
      
      // Add new point and maintain buffer size
      const currentData = newBuffers[lead] || [];
      const newData = [...currentData, newPoint];
      if (newData.length > BUFFER_SIZE) {
        newData.shift();
      }
      
      newBuffers[lead] = newData;
    });
    
    dataBufferRef.current = newBuffers;
    setEcgData(newBuffers);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 p-4 flex flex-col">
      {/* Header with patient info */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-white text-lg font-mono">
          {patientInfo.name} {patientInfo.gender} {patientInfo.age}
        </div>
        <div className="text-white text-lg font-mono">
          Gains x {settings.gains}
        </div>
      </div>
      
      {/* Settings row */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-400 text-sm font-mono">
          HighOut: {settings.highOut} LowOut: {settings.lowOut} Hum: {settings.hum} Pace: {settings.pace}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 gap-4">
        {/* ECG Charts Grid */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {LEAD_NAMES.map((lead) => (
            <div key={lead} className="bg-black rounded-lg p-2 border border-gray-700 relative">
              <div className="absolute top-2 left-4 z-10 text-sm font-mono" style={{ color: LEAD_COLORS[lead] }}>
                {lead}
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart
                  data={ecgData[lead] || []}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#333" 
                    horizontal={true} 
                    vertical={false} 
                  />
                  <XAxis 
                    dataKey="index"
                    tick={false}
                    axisLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    domain={[-1.5, 1.5]}
                    tick={false}
                    axisLine={{ stroke: '#666' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={LEAD_COLORS[lead]}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
        
        {/* Side panel */}
        <div className="w-48 bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-white font-mono text-center mb-2">HR</div>
          <div className="text-red-500 font-mono text-4xl">{heartRate}</div>
          <div className="text-white font-mono text-center mt-2">bpm</div>
          
          <div className="mt-8 flex flex-col gap-2 w-full">
            <button className="bg-blue-600 text-white font-mono py-2 rounded hover:bg-blue-700">
              ANALYZE
            </button>
            <button className="bg-gray-700 text-white font-mono py-2 rounded hover:bg-gray-600">
              MENU
            </button>
            <button className="bg-gray-700 text-white font-mono py-2 rounded hover:bg-gray-600">
              EXIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGRealtime;