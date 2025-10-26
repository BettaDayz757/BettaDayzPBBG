import React, { useState, useEffect, useCallback } from 'react';

// Gamepad button mappings for Xbox and PlayStation controllers
interface GamepadMapping {
  // Face buttons
  A: number; // Xbox A / PlayStation X
  B: number; // Xbox B / PlayStation Circle
  X: number; // Xbox X / PlayStation Square
  Y: number; // Xbox Y / PlayStation Triangle
  
  // Shoulder buttons
  LB: number; // Left Bumper / L1
  RB: number; // Right Bumper / R1
  LT: number; // Left Trigger / L2 (axis)
  RT: number; // Right Trigger / R2 (axis)
  
  // D-pad
  UP: number;
  DOWN: number;
  LEFT: number;
  RIGHT: number;
  
  // Menu buttons
  START: number; // Start / Options
  SELECT: number; // Back / Share
  HOME: number; // Xbox / PS button
  
  // Stick buttons
  LS: number; // Left stick click / L3
  RS: number; // Right stick click / R3
}

// Standard gamepad mapping (works for most Xbox and PlayStation controllers)
const STANDARD_MAPPING: GamepadMapping = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  SELECT: 8,
  START: 9,
  LS: 10,
  RS: 11,
  UP: 12,
  DOWN: 13,
  LEFT: 14,
  RIGHT: 15,
  HOME: 16
};

interface GamepadState {
  connected: boolean;
  id: string;
  buttons: boolean[];
  axes: number[];
  vibration?: boolean;
}

interface GamepadControls {
  movement: { x: number; y: number };
  camera: { x: number; y: number };
  actions: {
    jump: boolean;
    run: boolean;
    interact: boolean;
    menu: boolean;
    map: boolean;
    phone: boolean;
    vehicle: boolean;
    weapon: boolean;
  };
}

export default function GamepadSupport({
  onControlsUpdate,
  onGamepadConnect,
  onGamepadDisconnect
}: {
  onControlsUpdate: (controls: GamepadControls) => void;
  onGamepadConnect: (gamepad: GamepadState) => void;
  onGamepadDisconnect: () => void;
}) {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [showGamepadUI, setShowGamepadUI] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Detect gamepad connection/disconnection
  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad.id);
      const gamepadState: GamepadState = {
        connected: true,
        id: e.gamepad.id,
        buttons: Array.from(e.gamepad.buttons).map(b => b.pressed),
        axes: Array.from(e.gamepad.axes),
        vibration: 'vibrationActuator' in e.gamepad
      };
      
      setGamepads((prev: GamepadState[]) => {
        const newGamepads = [...prev];
        newGamepads[e.gamepad.index] = gamepadState;
        return newGamepads;
      });
      
      onGamepadConnect(gamepadState);
      setShowGamepadUI(true);
      
      // Hide UI after 3 seconds
      setTimeout(() => setShowGamepadUI(false), 3000);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      setGamepads((prev: GamepadState[]) => {
        const newGamepads = [...prev];
        delete newGamepads[e.gamepad.index];
        return newGamepads;
      });
      onGamepadDisconnect();
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [onGamepadConnect, onGamepadDisconnect]);

  // Gamepad input polling
  const pollGamepads = useCallback(() => {
    const gamepadList = navigator.getGamepads();
    
    for (let i = 0; i < gamepadList.length; i++) {
      const gamepad = gamepadList[i];
      if (!gamepad) continue;

      // Update gamepad state
      const gamepadState: GamepadState = {
        connected: gamepad.connected,
        id: gamepad.id,
        buttons: Array.from(gamepad.buttons).map(b => b.pressed),
        axes: Array.from(gamepad.axes),
        vibration: 'vibrationActuator' in gamepad
      };

      setGamepads(prev => {
        const newGamepads = [...prev];
        newGamepads[i] = gamepadState;
        return newGamepads;
      });

      // Process controls
      const controls: GamepadControls = {
        movement: {
          x: Math.abs(gamepad.axes[0]) > 0.1 ? gamepad.axes[0] : 0,
          y: Math.abs(gamepad.axes[1]) > 0.1 ? gamepad.axes[1] : 0
        },
        camera: {
          x: Math.abs(gamepad.axes[2]) > 0.1 ? gamepad.axes[2] : 0,
          y: Math.abs(gamepad.axes[3]) > 0.1 ? gamepad.axes[3] : 0
        },
        actions: {
          jump: gamepad.buttons[STANDARD_MAPPING.A]?.pressed || false,
          run: gamepad.buttons[STANDARD_MAPPING.RB]?.pressed || false,
          interact: gamepad.buttons[STANDARD_MAPPING.X]?.pressed || false,
          menu: gamepad.buttons[STANDARD_MAPPING.START]?.pressed || false,
          map: gamepad.buttons[STANDARD_MAPPING.SELECT]?.pressed || false,
          phone: gamepad.buttons[STANDARD_MAPPING.Y]?.pressed || false,
          vehicle: gamepad.buttons[STANDARD_MAPPING.B]?.pressed || false,
          weapon: gamepad.buttons[STANDARD_MAPPING.LB]?.pressed || false
        }
      };

      onControlsUpdate(controls);

      // Trigger vibration for certain actions
      if (vibrationEnabled && gamepad.vibrationActuator) {
        if (controls.actions.jump || controls.actions.weapon) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 100,
            strongMagnitude: 0.3,
            weakMagnitude: 0.1
          });
        }
      }
    }
  }, [onControlsUpdate, vibrationEnabled]);

  // Start polling when component mounts
  useEffect(() => {
    const interval = setInterval(pollGamepads, 16); // ~60fps
    return () => clearInterval(interval);
  }, [pollGamepads]);

  const getControllerType = (id: string): string => {
    if (id.toLowerCase().includes('xbox')) return 'Xbox';
    if (id.toLowerCase().includes('playstation') || id.toLowerCase().includes('dualshock') || id.toLowerCase().includes('dualsense')) return 'PlayStation';
    return 'Generic';
  };

  const getControllerIcon = (id: string): string => {
    const type = getControllerType(id);
    switch (type) {
      case 'Xbox': return '🎮';
      case 'PlayStation': return '🕹️';
      default: return '🎯';
    }
  };

  const connectedGamepads = gamepads.filter(g => g && g.connected);

  return (
    <>
      {/* Gamepad Connection UI */}
      {showGamepadUI && connectedGamepads.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-green-400 font-bold mb-2">🎮 Controller Connected</div>
          {connectedGamepads.map((gamepad, index) => (
            <div key={index} className="text-white text-sm">
              <span className="mr-2">{getControllerIcon(gamepad.id)}</span>
              {getControllerType(gamepad.id)} Controller
              {gamepad.vibration && <span className="ml-2 text-purple-400">📳</span>}
            </div>
          ))}
        </div>
      )}

      {/* Gamepad Controls Help */}
      {connectedGamepads.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setShowGamepadUI(!showGamepadUI)}
            className="bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-lg border border-white/20 hover:bg-gray-800/80 transition-colors"
          >
            🎮 Controls
          </button>
          
          {showGamepadUI && (
            <div className="absolute bottom-12 left-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-white/20 min-w-80">
              <h3 className="text-white font-bold mb-3">🎮 Controller Layout</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-400 font-semibold mb-2">Movement</div>
                  <div className="text-gray-300 space-y-1">
                    <div>🕹️ Left Stick: Move</div>
                    <div>🕹️ Right Stick: Camera</div>
                    <div>🔘 A/X: Jump</div>
                    <div>🔘 RB/R1: Run</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-green-400 font-semibold mb-2">Actions</div>
                  <div className="text-gray-300 space-y-1">
                    <div>🔘 X/□: Interact</div>
                    <div>🔘 B/○: Vehicle</div>
                    <div>🔘 Y/△: Phone</div>
                    <div>🔘 LB/L1: Weapon</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-purple-400 font-semibold mb-2">Menu</div>
                  <div className="text-gray-300 space-y-1">
                    <div>⏸️ Start/Options: Menu</div>
                    <div>⏹️ Select/Share: Map</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">Settings</div>
                  <div className="text-gray-300 space-y-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={vibrationEnabled}
                        onChange={(e) => setVibrationEnabled(e.target.checked)}
                        className="rounded"
                      />
                      <span>Vibration</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400">
                  Supports Xbox and PlayStation controllers
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Controller Message */}
      {connectedGamepads.length === 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-gray-900/80 backdrop-blur-sm text-gray-400 p-2 rounded-lg border border-white/10 text-sm">
            🎮 Connect a controller for enhanced gameplay
          </div>
        </div>
      )}
    </>
  );
}

// Hook for using gamepad controls in components
export function useGamepadControls() {
  const [controls, setControls] = useState<GamepadControls>({
    movement: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    actions: {
      jump: false,
      run: false,
      interact: false,
      menu: false,
      map: false,
      phone: false,
      vehicle: false,
      weapon: false
    }
  });

  const [gamepadConnected, setGamepadConnected] = useState(false);

  const handleControlsUpdate = useCallback((newControls: GamepadControls) => {
    setControls(newControls);
  }, []);

  const handleGamepadConnect = useCallback((gamepad: GamepadState) => {
    setGamepadConnected(true);
    console.log('Gamepad connected in hook:', gamepad.id);
  }, []);

  const handleGamepadDisconnect = useCallback(() => {
    setGamepadConnected(false);
    // Reset controls when gamepad disconnects
    setControls({
      movement: { x: 0, y: 0 },
      camera: { x: 0, y: 0 },
      actions: {
        jump: false,
        run: false,
        interact: false,
        menu: false,
        map: false,
        phone: false,
        vehicle: false,
        weapon: false
      }
    });
  }, []);

  return {
    controls,
    gamepadConnected,
    handleControlsUpdate,
    handleGamepadConnect,
    handleGamepadDisconnect
  };
}