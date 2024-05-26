"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Extend THREE namespace
extend({ BoxBufferGeometry: THREE.BoxGeometry });

import { config } from './config';

interface SettingsProps {
  useTTS: boolean;
  useInternet: boolean;
  usePhotos: boolean;
  useLudicrousMode: boolean;
  useRabbitMode: boolean;
  onToggle: (setting: string) => void;
  setSetting: (setting: string, value: boolean) => void;
}

const ToggleSwitch: React.FC<{ id: string; label: string; checked: boolean; onChange: () => void; disabled?: boolean }> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
}) => (
  <div className="flex items-center mb-2 touch-friendly">
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} disabled={disabled} />
        <div className={`block w-12 h-8 rounded-full ${checked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-full' : ''}`}></div>
      </div>
      <div className="ml-3 text-lg text-black">{label}</div>
    </label>
  </div>
);

const InteractiveToggle: React.FC<{ checked: boolean; onToggle: () => void }> = ({ checked, onToggle }) => {
  const mesh = useRef<any>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} onClick={onToggle}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={checked ? 'green' : 'gray'} />
      <Html>
        <div className="toggle-label text-black">{checked ? 'ON' : 'OFF'}</div>
      </Html>
    </mesh>
  );
};

const Settings: React.FC<SettingsProps> = ({
  useTTS,
  useInternet,
  usePhotos,
  useLudicrousMode,
  useRabbitMode,
  onToggle,
  setSetting,
}) => {
  const handleLudicrousModeToggle = () => {
    onToggle('useLudicrousMode');
    if (!useLudicrousMode) {
      setSetting('useTTS', false);
      setSetting('useInternet', false);
      setSetting('usePhotos', false);
    }
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Ludicrous mode activated"));
  };

  return (
    <div className="settings-container absolute bottom-24 left-7 bg-white rounded-md shadow-md p-4 animate-slide-up touch-friendly">
      {config.enabledLudicrousMode && (
        <>
          <Canvas>
            <InteractiveToggle checked={useLudicrousMode} onToggle={handleLudicrousModeToggle} />
          </Canvas>
          <div className="text-xs text-gray-700 mb-2">(Groq Llama3 + Groq Whisper only)</div>
        </>
      )}
      {config.enableTextToSpeechUIToggle && (
        <ToggleSwitch id="tts-toggle" label="Text-to-Speech" checked={useTTS && !useLudicrousMode} onChange={() => onToggle('useTTS')} disabled={useLudicrousMode} />
      )}
      {config.enableInternetResultsUIToggle && (
        <ToggleSwitch id="internet-toggle" label="Use Internet Results" checked={useInternet && !useLudicrousMode} onChange={() => onToggle('useInternet')} disabled={useLudicrousMode} />
      )}
      {config.enableUsePhotUIToggle && (
        <ToggleSwitch id="photos-toggle" label="Use Photos" checked={usePhotos && !useLudicrousMode} onChange={() => onToggle('usePhotos')} disabled={useLudicrousMode} />
      )}
      <ToggleSwitch id="rabbit-mode-toggle" label="Rabbit Mode" checked={useRabbitMode} onChange={() => onToggle('useRabbitMode')} />
    </div>
  );
};

const Page: React.FC = () => {
  return <Settings
    useTTS={false}
    useInternet={false}
    usePhotos={false}
    useLudicrousMode={false}
    useRabbitMode={false}
    onToggle={() => {}}
    setSetting={() => {}}
  />;
};

export default Page;
