import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameSettings {
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    shadows: boolean;
    particles: boolean;
    antiAliasing: boolean;
    vsync: boolean;
    frameRate: 30 | 60 | 120 | 'unlimited';
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    voiceVolume: number;
    muted: boolean;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard' | 'expert';
    autoSave: boolean;
    autoSaveInterval: 5 | 10 | 15 | 30; // minutes
    showTutorials: boolean;
    showNotifications: boolean;
    fastTravel: boolean;
    pauseOnFocusLoss: boolean;
  };
  controls: {
    mouseSensitivity: number;
    invertY: boolean;
    gamepadEnabled: boolean;
    gamepadVibration: boolean;
    keyBindings: Record<string, string>;
  };
  display: {
    resolution: string;
    fullscreen: boolean;
    borderless: boolean;
    uiScale: number;
    colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    highContrast: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
    onlineFeatures: boolean;
    shareProgress: boolean;
  };
}

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: GameSettings) => void;
}

const defaultSettings: GameSettings = {
  graphics: {
    quality: 'medium',
    shadows: true,
    particles: true,
    antiAliasing: true,
    vsync: true,
    frameRate: 60
  },
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 85,
    voiceVolume: 90,
    muted: false
  },
  gameplay: {
    difficulty: 'normal',
    autoSave: true,
    autoSaveInterval: 10,
    showTutorials: true,
    showNotifications: true,
    fastTravel: true,
    pauseOnFocusLoss: true
  },
  controls: {
    mouseSensitivity: 50,
    invertY: false,
    gamepadEnabled: true,
    gamepadVibration: true,
    keyBindings: {
      moveForward: 'W',
      moveBackward: 'S',
      moveLeft: 'A',
      moveRight: 'D',
      jump: 'Space',
      crouch: 'C',
      run: 'Shift',
      interact: 'E',
      inventory: 'I',
      map: 'M',
      menu: 'Escape',
      chat: 'Enter'
    }
  },
  display: {
    resolution: '1920x1080',
    fullscreen: false,
    borderless: true,
    uiScale: 100,
    colorBlind: 'none',
    highContrast: false
  },
  privacy: {
    analytics: true,
    crashReports: true,
    onlineFeatures: true,
    shareProgress: false
  }
};

const resolutionOptions = [
  '1280x720',
  '1366x768',
  '1600x900',
  '1920x1080',
  '2560x1440',
  '3840x2160'
];

export default function SettingsMenu({ isOpen, onClose, onSettingsChange }: SettingsMenuProps) {
  const [selectedTab, setSelectedTab] = useState<'graphics' | 'audio' | 'gameplay' | 'controls' | 'display' | 'privacy' | 'account'>('graphics');
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [keyBindingMode, setKeyBindingMode] = useState<string | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('bettadayz-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSettings = (category: keyof GameSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('bettadayz-settings', JSON.stringify(settings));
    onSettingsChange(settings);
    setUnsavedChanges(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setUnsavedChanges(true);
  };

  const handleKeyBinding = (action: string, event: KeyboardEvent) => {
    event.preventDefault();
    const key = event.key === ' ' ? 'Space' : event.key;
    updateSettings('controls', 'keyBindings', {
      ...settings.controls.keyBindings,
      [action]: key
    });
    setKeyBindingMode(null);
  };

  useEffect(() => {
    if (keyBindingMode) {
      const handleKeyPress = (event: KeyboardEvent) => {
        handleKeyBinding(keyBindingMode, event);
      };
      
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [keyBindingMode]);

  const VolumeSlider = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-white font-medium">{label}</label>
        <span className="text-gray-400">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <label className="text-white font-medium">{label}</label>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <label className="text-white font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Settings</h2>
              <div className="flex items-center space-x-4">
                {unsavedChanges && (
                  <span className="text-yellow-400 text-sm">Unsaved changes</span>
                )}
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-400 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tab Navigation */}
              <div className="space-y-2">
                {[
                  { id: 'graphics', label: 'Graphics', icon: '🎮' },
                  { id: 'audio', label: 'Audio', icon: '🔊' },
                  { id: 'gameplay', label: 'Gameplay', icon: '⚙️' },
                  { id: 'controls', label: 'Controls', icon: '🎯' },
                  { id: 'display', label: 'Display', icon: '🖥️' },
                  { id: 'privacy', label: 'Privacy', icon: '🔒' },
                  { id: 'account', label: 'Account', icon: '👤' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                      selectedTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3 bg-gray-800 rounded-lg p-6 space-y-6">
                {selectedTab === 'graphics' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Graphics Settings</h3>
                    
                    <Select
                      label="Graphics Quality"
                      value={settings.graphics.quality}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                        { value: 'ultra', label: 'Ultra' }
                      ]}
                      onChange={(value) => updateSettings('graphics', 'quality', value)}
                    />

                    <Select
                      label="Frame Rate Limit"
                      value={settings.graphics.frameRate.toString()}
                      options={[
                        { value: '30', label: '30 FPS' },
                        { value: '60', label: '60 FPS' },
                        { value: '120', label: '120 FPS' },
                        { value: 'unlimited', label: 'Unlimited' }
                      ]}
                      onChange={(value) => updateSettings('graphics', 'frameRate', value === 'unlimited' ? 'unlimited' : parseInt(value))}
                    />

                    <Toggle
                      label="Shadows"
                      checked={settings.graphics.shadows}
                      onChange={(checked) => updateSettings('graphics', 'shadows', checked)}
                      description="Enable dynamic shadows for better visual quality"
                    />

                    <Toggle
                      label="Particle Effects"
                      checked={settings.graphics.particles}
                      onChange={(checked) => updateSettings('graphics', 'particles', checked)}
                      description="Show particle effects like smoke, fire, and explosions"
                    />

                    <Toggle
                      label="Anti-Aliasing"
                      checked={settings.graphics.antiAliasing}
                      onChange={(checked) => updateSettings('graphics', 'antiAliasing', checked)}
                      description="Smooth jagged edges for cleaner visuals"
                    />

                    <Toggle
                      label="V-Sync"
                      checked={settings.graphics.vsync}
                      onChange={(checked) => updateSettings('graphics', 'vsync', checked)}
                      description="Prevent screen tearing by syncing with monitor refresh rate"
                    />
                  </div>
                )}

                {selectedTab === 'audio' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Audio Settings</h3>
                    
                    <Toggle
                      label="Mute All Audio"
                      checked={settings.audio.muted}
                      onChange={(checked) => updateSettings('audio', 'muted', checked)}
                    />

                    <VolumeSlider
                      label="Master Volume"
                      value={settings.audio.masterVolume}
                      onChange={(value) => updateSettings('audio', 'masterVolume', value)}
                    />

                    <VolumeSlider
                      label="Music Volume"
                      value={settings.audio.musicVolume}
                      onChange={(value) => updateSettings('audio', 'musicVolume', value)}
                    />

                    <VolumeSlider
                      label="Sound Effects Volume"
                      value={settings.audio.sfxVolume}
                      onChange={(value) => updateSettings('audio', 'sfxVolume', value)}
                    />

                    <VolumeSlider
                      label="Voice Volume"
                      value={settings.audio.voiceVolume}
                      onChange={(value) => updateSettings('audio', 'voiceVolume', value)}
                    />
                  </div>
                )}

                {selectedTab === 'gameplay' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Gameplay Settings</h3>
                    
                    <Select
                      label="Difficulty"
                      value={settings.gameplay.difficulty}
                      options={[
                        { value: 'easy', label: 'Easy' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'hard', label: 'Hard' },
                        { value: 'expert', label: 'Expert' }
                      ]}
                      onChange={(value) => updateSettings('gameplay', 'difficulty', value)}
                    />

                    <Toggle
                      label="Auto Save"
                      checked={settings.gameplay.autoSave}
                      onChange={(checked) => updateSettings('gameplay', 'autoSave', checked)}
                      description="Automatically save your progress"
                    />

                    <Select
                      label="Auto Save Interval"
                      value={settings.gameplay.autoSaveInterval.toString()}
                      options={[
                        { value: '5', label: '5 minutes' },
                        { value: '10', label: '10 minutes' },
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' }
                      ]}
                      onChange={(value) => updateSettings('gameplay', 'autoSaveInterval', parseInt(value))}
                    />

                    <Toggle
                      label="Show Tutorials"
                      checked={settings.gameplay.showTutorials}
                      onChange={(checked) => updateSettings('gameplay', 'showTutorials', checked)}
                      description="Display helpful tutorials and tips"
                    />

                    <Toggle
                      label="Show Notifications"
                      checked={settings.gameplay.showNotifications}
                      onChange={(checked) => updateSettings('gameplay', 'showNotifications', checked)}
                      description="Show in-game notifications and alerts"
                    />

                    <Toggle
                      label="Fast Travel"
                      checked={settings.gameplay.fastTravel}
                      onChange={(checked) => updateSettings('gameplay', 'fastTravel', checked)}
                      description="Enable quick travel between discovered locations"
                    />

                    <Toggle
                      label="Pause on Focus Loss"
                      checked={settings.gameplay.pauseOnFocusLoss}
                      onChange={(checked) => updateSettings('gameplay', 'pauseOnFocusLoss', checked)}
                      description="Automatically pause when switching to another window"
                    />
                  </div>
                )}

                {selectedTab === 'controls' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Controls Settings</h3>
                    
                    <div className="space-y-2">
                      <label className="text-white font-medium">Mouse Sensitivity</label>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Low</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={settings.controls.mouseSensitivity}
                          onChange={(e) => updateSettings('controls', 'mouseSensitivity', parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-gray-400">High</span>
                        <span className="text-white w-8">{settings.controls.mouseSensitivity}</span>
                      </div>
                    </div>

                    <Toggle
                      label="Invert Y-Axis"
                      checked={settings.controls.invertY}
                      onChange={(checked) => updateSettings('controls', 'invertY', checked)}
                      description="Invert vertical mouse movement"
                    />

                    <Toggle
                      label="Gamepad Support"
                      checked={settings.controls.gamepadEnabled}
                      onChange={(checked) => updateSettings('controls', 'gamepadEnabled', checked)}
                      description="Enable controller/gamepad input"
                    />

                    <Toggle
                      label="Gamepad Vibration"
                      checked={settings.controls.gamepadVibration}
                      onChange={(checked) => updateSettings('controls', 'gamepadVibration', checked)}
                      description="Enable controller vibration feedback"
                    />

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-white">Key Bindings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(settings.controls.keyBindings).map(([action, key]) => (
                          <div key={action} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-white capitalize">
                              {action.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <button
                              onClick={() => setKeyBindingMode(action)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                keyBindingMode === action
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-600 text-white hover:bg-gray-500'
                              }`}
                            >
                              {keyBindingMode === action ? 'Press key...' : key}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'display' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Display Settings</h3>
                    
                    <Select
                      label="Resolution"
                      value={settings.display.resolution}
                      options={resolutionOptions.map(res => ({ value: res, label: res }))}
                      onChange={(value) => updateSettings('display', 'resolution', value)}
                    />

                    <Toggle
                      label="Fullscreen"
                      checked={settings.display.fullscreen}
                      onChange={(checked) => updateSettings('display', 'fullscreen', checked)}
                      description="Run game in fullscreen mode"
                    />

                    <Toggle
                      label="Borderless Window"
                      checked={settings.display.borderless}
                      onChange={(checked) => updateSettings('display', 'borderless', checked)}
                      description="Remove window borders for seamless alt-tabbing"
                    />

                    <div className="space-y-2">
                      <label className="text-white font-medium">UI Scale</label>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Small</span>
                        <input
                          type="range"
                          min="75"
                          max="150"
                          step="25"
                          value={settings.display.uiScale}
                          onChange={(e) => updateSettings('display', 'uiScale', parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-gray-400">Large</span>
                        <span className="text-white w-12">{settings.display.uiScale}%</span>
                      </div>
                    </div>

                    <Select
                      label="Color Blind Support"
                      value={settings.display.colorBlind}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'protanopia', label: 'Protanopia (Red-blind)' },
                        { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
                        { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
                      ]}
                      onChange={(value) => updateSettings('display', 'colorBlind', value)}
                    />

                    <Toggle
                      label="High Contrast Mode"
                      checked={settings.display.highContrast}
                      onChange={(checked) => updateSettings('display', 'highContrast', checked)}
                      description="Increase contrast for better visibility"
                    />
                  </div>
                )}

                {selectedTab === 'privacy' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Privacy Settings</h3>
                    
                    <Toggle
                      label="Analytics"
                      checked={settings.privacy.analytics}
                      onChange={(checked) => updateSettings('privacy', 'analytics', checked)}
                      description="Help improve the game by sharing anonymous usage data"
                    />

                    <Toggle
                      label="Crash Reports"
                      checked={settings.privacy.crashReports}
                      onChange={(checked) => updateSettings('privacy', 'crashReports', checked)}
                      description="Automatically send crash reports to help fix bugs"
                    />

                    <Toggle
                      label="Online Features"
                      checked={settings.privacy.onlineFeatures}
                      onChange={(checked) => updateSettings('privacy', 'onlineFeatures', checked)}
                      description="Enable online features like leaderboards and social sharing"
                    />

                    <Toggle
                      label="Share Progress"
                      checked={settings.privacy.shareProgress}
                      onChange={(checked) => updateSettings('privacy', 'shareProgress', checked)}
                      description="Allow friends to see your game progress and achievements"
                    />
                  </div>
                )}

                {selectedTab === 'account' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Account Management</h3>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-2">Profile Information</h4>
                      <div className="space-y-2 text-gray-300">
                        <p><strong>Username:</strong> Player123</p>
                        <p><strong>Email:</strong> player@example.com</p>
                        <p><strong>Account Created:</strong> January 15, 2024</p>
                        <p><strong>Last Login:</strong> Today</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Change Password
                      </button>
                      <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Update Email
                      </button>
                      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Export Save Data
                      </button>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Delete Account
                      </button>
                    </div>

                    <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-yellow-400 mb-2">⚠️ Data Management</h4>
                      <p className="text-yellow-200 text-sm">
                        Your game data is stored locally on your device. Make sure to export your save data regularly to prevent loss.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={resetSettings}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  disabled={!unsavedChanges}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    unsavedChanges
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}