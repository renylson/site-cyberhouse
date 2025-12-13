'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Download, Upload, Zap } from 'lucide-react';
import PublicPageWrapper from '@/components/PublicPageWrapper';

interface Position {
  id: number;
  name: string;
}

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  ip?: string;
}

export default function TesteVelocidadePage() {
  const [isTesting, setIsTesting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [clientIP, setClientIP] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const startTest = async () => {
    setIsTesting(true);
    setCurrentPhase('download');
    setProgress(0);
    setResults(null);
    abortControllerRef.current = new AbortController();

    try {
      // Buscar IP do cliente primeiro
      const ipResponse = await fetch('/api/speed-test/ip');
      const ipData = await ipResponse.json();
      setClientIP(ipData.ip);

      // Teste de download (mínimo 10 segundos)
      const downloadResult = await testDownload();
      setCurrentPhase('upload');

      // Teste de upload (mínimo 10 segundos)
      const uploadResult = await testUpload();
      setCurrentPhase('ping');

      // Teste de ping
      const pingResult = await testPing();

      setResults({
        download: downloadResult,
        upload: uploadResult,
        ping: pingResult,
        ip: ipData.ip
      });

      setCurrentPhase('complete');
      setProgress(100);

    } catch (error) {
      console.error('Test failed:', error);
      setIsTesting(false);
      setCurrentPhase('idle');
    }
  };

  const testPing = async (): Promise<number> => {
    const pings: number[] = [];
    const testCount = 5;

    for (let i = 0; i < testCount; i++) {
      const start = Date.now();
      try {
        const response = await fetch('/api/speed-test/ping', {
          signal: abortControllerRef.current?.signal,
          cache: 'no-cache'
        });
        const end = Date.now();
        pings.push(end - start);
        setProgress(80 + (i + 1) / testCount * 20); // 80-100% para ping (último)
      } catch (error) {
        pings.push(999);
      }
    }

    // Remove o maior e menor valor e calcula a média
    pings.sort((a, b) => a - b);
    const validPings = pings.slice(1, -1);
    return validPings.reduce((sum, ping) => sum + ping, 0) / validPings.length;
  };

  const testDownload = async (): Promise<number> => {
    const downloadSizes = [1, 2, 4, 8]; // MB
    const speeds: number[] = [];
    let totalProgress = 0; // Começa do início
    const minDuration = 10000; // 10 segundos mínimo
    const testStart = Date.now();

    // Garantir que o teste dure pelo menos 10 segundos
    while (Date.now() - testStart < minDuration) {
      for (const size of downloadSizes) {
        try {
          const start = Date.now();

          const response = await fetch(`/api/speed-test/download?size=${size}&t=${Date.now()}`, {
            signal: abortControllerRef.current?.signal,
            cache: 'no-cache',
            method: 'GET'
          });

          if (!response.ok) throw new Error('Download failed');

          const reader = response.body?.getReader();
          if (!reader) throw new Error('No reader available');

          let received = 0;
          const total = size * 1024 * 1024; // bytes
          const chunks: Uint8Array[] = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            received += value.length;

            const elapsed = (Date.now() - start) / 1000; // seconds
            const speedMbps = (received * 8) / (1024 * 1024) / elapsed; // Mbps

            setCurrentSpeed(speedMbps);
            const overallProgress = ((Date.now() - testStart) / minDuration) * 60; // 60% para download
            setProgress(Math.min(overallProgress, 60));
          }

          const finalElapsed = (Date.now() - start) / 1000;
          const finalSpeed = (total * 8) / (1024 * 1024) / finalElapsed;
          speeds.push(finalSpeed);

        } catch (error) {
          console.error(`Download test ${size}MB failed:`, error);
          speeds.push(0);
        }

        // Verificar se já passou 10 segundos
        if (Date.now() - testStart >= minDuration) break;
      }

      // Verificar se já passou 10 segundos
      if (Date.now() - testStart >= minDuration) break;
    }

    // Retorna a velocidade média dos testes válidos
    const validSpeeds = speeds.filter(speed => speed > 0);
    return validSpeeds.length > 0
      ? validSpeeds.reduce((sum, speed) => sum + speed, 0) / validSpeeds.length
      : 0;
  };

  const testUpload = async (): Promise<number> => {
    const uploadSizes = [0.5, 1, 2]; // MB
    const speeds: number[] = [];
    const minDuration = 10000; // 10 segundos mínimo
    const testStart = Date.now();

    // Garantir que o teste dure pelo menos 10 segundos
    while (Date.now() - testStart < minDuration) {
      for (const size of uploadSizes) {
        try {
          // Cria dados de teste menores para upload
          const dataSize = size * 1024 * 1024; // bytes
          const chunkSize = 64 * 1024; // 64KB chunks
          const data = new Uint8Array(dataSize);

          // Preenche com dados aleatórios
          for (let i = 0; i < dataSize; i++) {
            data[i] = Math.floor(Math.random() * 256);
          }

          const start = Date.now();

          const response = await fetch('/api/speed-test/upload', {
            method: 'POST',
            body: data,
            signal: abortControllerRef.current?.signal,
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          });

          if (!response.ok) throw new Error('Upload failed');

          const result = await response.json();
          const speedMbps = result.speedMbps;

          speeds.push(speedMbps);
          setCurrentSpeed(speedMbps);
          const overallProgress = 60 + ((Date.now() - testStart) / minDuration) * 20; // 60-80% para upload
          setProgress(Math.min(overallProgress, 80));

        } catch (error) {
          console.error(`Upload test ${size}MB failed:`, error);
          speeds.push(0);
        }

        // Verificar se já passou 10 segundos
        if (Date.now() - testStart >= minDuration) break;
      }

      // Verificar se já passou 10 segundos
      if (Date.now() - testStart >= minDuration) break;
    }

    // Retorna a velocidade média dos testes válidos
    const validSpeeds = speeds.filter(speed => speed > 0);
    return validSpeeds.length > 0
      ? validSpeeds.reduce((sum, speed) => sum + speed, 0) / validSpeeds.length
      : 0;
  };

  const stopTest = () => {
    abortControllerRef.current?.abort();
    setIsTesting(false);
    setCurrentPhase('idle');
    setProgress(0);
    setCurrentSpeed(0);
  };

  const resetTest = () => {
    setResults(null);
    setCurrentPhase('idle');
    setProgress(0);
    setCurrentSpeed(0);
  };

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(2)} Gbps`;
    } else if (speed >= 1) {
      return `${speed.toFixed(2)} Mbps`;
    } else {
      return `${(speed * 1000).toFixed(0)} Kbps`;
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'ping': return 'Testando latência...';
      case 'download': return 'Testando download...';
      case 'upload': return 'Testando upload...';
      case 'complete': return 'Teste concluído!';
      default: return 'Pronto para testar';
    }
  };

  return (
    <PublicPageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-6"
            >
              <Zap className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Teste de Velocidade</h1>
            </motion.div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meça a velocidade da sua conexão com a internet de forma rápida e precisa
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Gauge/Speed Display */}
            <div className="text-center mb-8">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />

                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={currentPhase === 'download' ? '#3b82f6' : currentPhase === 'upload' ? '#10b981' : '#6b7280'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {isTesting || results ? formatSpeed(currentSpeed || results?.download || 0) : '--'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getPhaseText()}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {isTesting && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{formatSpeed(results.download)}</div>
                  <div className="text-sm text-blue-700">Download</div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{formatSpeed(results.upload)}</div>
                  <div className="text-sm text-green-700">Upload</div>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">MS</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{Math.round(results.ping)}ms</div>
                  <div className="text-sm text-purple-700">Latência</div>
                </div>
              </motion.div>
            )}

            {/* IP Address */}
            {(clientIP || results?.ip) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xs">IP</span>
                  </div>
                  <span className="text-gray-900 font-medium">Seu IP: {clientIP || results?.ip}</span>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="text-center">
              {!isTesting && !results && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Iniciar Teste
                </motion.button>
              )}

              {isTesting && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopTest}
                  className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors flex items-center mx-auto"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Parar Teste
                </motion.button>
              )}

              {results && !isTesting && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTest}
                  className="bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors flex items-center mx-auto"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Novo Teste
                </motion.button>
              )}
            </div>

            {/* Info */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Para resultados mais precisos, feche outras aplicações que usam internet durante o teste.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicPageWrapper>
  );
}