import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Video, 
  VideoOff, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Scissors, 
  Activity, 
  RefreshCw, 
  Sliders, 
  Maximize2, 
  Eye, 
  Check, 
  X, 
  Edit2, 
  Zap, 
  Layers,
  ChevronRight,
  Wifi,
  WifiOff,
  Cpu
} from 'lucide-react';

interface WorkstationStation {
  id: string;
  name: string;
  room: string;
  branchId: string;
  type: 'styling' | 'wash' | 'spa' | 'color';
  cameraStream: {
    status: 'online' | 'standby' | 'setup_required';
    fps: number;
    resolution: string;
    latencyMs: number;
    rtspEndpoint: string;
  };
  occupancy: {
    status: 'occupied' | 'available' | 'buffer';
    confidence: number;
    elapsedMinutes: number;
    estimatedTotalMinutes: number;
  };
  detectedRitual: {
    serviceName: string;
    stylistName: string;
    currentMilestone: string;
    detectedAt: string;
    isHumanConfirmed: boolean;
  };
}

const INITIAL_WORKSTATIONS: WorkstationStation[] = [
  {
    id: 'BAY-A1',
    name: 'Mirror Bay 01',
    room: 'Main Styling Hall',
    branchId: 'branch-jubilee-flagship',
    type: 'styling',
    cameraStream: {
      status: 'online',
      fps: 24,
      resolution: '1080p @ 30fps',
      latencyMs: 42,
      rtspEndpoint: 'rtsp://edge-gw.jubilee.glamoure.internal/live/bay01',
    },
    occupancy: {
      status: 'occupied',
      confidence: 96,
      elapsedMinutes: 28,
      estimatedTotalMinutes: 60,
    },
    detectedRitual: {
      serviceName: 'Haute Balayage Lightening',
      stylistName: 'Elena Vance',
      currentMilestone: 'Precision Foil Application (Phase 2)',
      detectedAt: '14:32',
      isHumanConfirmed: true,
    },
  },
  {
    id: 'BAY-A2',
    name: 'Mirror Bay 02',
    room: 'Main Styling Hall',
    branchId: 'branch-jubilee-flagship',
    type: 'styling',
    cameraStream: {
      status: 'online',
      fps: 24,
      resolution: '1080p @ 30fps',
      latencyMs: 38,
      rtspEndpoint: 'rtsp://edge-gw.jubilee.glamoure.internal/live/bay02',
    },
    occupancy: {
      status: 'available',
      confidence: 99,
      elapsedMinutes: 0,
      estimatedTotalMinutes: 0,
    },
    detectedRitual: {
      serviceName: 'Sanitized & Ready',
      stylistName: 'Unassigned',
      currentMilestone: 'Station Prepped for Next Guest',
      detectedAt: '15:02',
      isHumanConfirmed: true,
    },
  },
  {
    id: 'COLOR-01',
    name: 'Color Laboratory Station 1',
    room: 'Color & Chemical Studio',
    branchId: 'branch-jubilee-flagship',
    type: 'color',
    cameraStream: {
      status: 'online',
      fps: 25,
      resolution: '1080p @ 30fps',
      latencyMs: 45,
      rtspEndpoint: 'rtsp://edge-gw.jubilee.glamoure.internal/live/color01',
    },
    occupancy: {
      status: 'occupied',
      confidence: 94,
      elapsedMinutes: 44,
      estimatedTotalMinutes: 75,
    },
    detectedRitual: {
      serviceName: 'Glossing & Glaze Integration',
      stylistName: 'Marcus Reed',
      currentMilestone: 'Emulsion & Color Rinsing Scheduled',
      detectedAt: '14:15',
      isHumanConfirmed: true,
    },
  },
  {
    id: 'WASH-01',
    name: 'Shampoo & Scalp Basin 01',
    room: 'Hydro-Therapy Lounge',
    branchId: 'branch-jubilee-flagship',
    type: 'wash',
    cameraStream: {
      status: 'online',
      fps: 24,
      resolution: '1080p @ 30fps',
      latencyMs: 51,
      rtspEndpoint: 'rtsp://edge-gw.jubilee.glamoure.internal/live/wash01',
    },
    occupancy: {
      status: 'occupied',
      confidence: 91,
      elapsedMinutes: 14,
      estimatedTotalMinutes: 20,
    },
    detectedRitual: {
      serviceName: 'Ozone Scalp Exfoliation Ritual',
      stylistName: 'Aria Chen',
      currentMilestone: 'Warm Towel Steam & Head Massage',
      detectedAt: '14:46',
      isHumanConfirmed: false,
    },
  },
  {
    id: 'WASH-02',
    name: 'Shampoo & Scalp Basin 02',
    room: 'Hydro-Therapy Lounge',
    branchId: 'branch-banjara-sanctuary',
    type: 'wash',
    cameraStream: {
      status: 'online',
      fps: 24,
      resolution: '1080p @ 30fps',
      latencyMs: 40,
      rtspEndpoint: 'rtsp://edge-gw.banjara.glamoure.internal/live/wash02',
    },
    occupancy: {
      status: 'buffer',
      confidence: 98,
      elapsedMinutes: 6,
      estimatedTotalMinutes: 10,
    },
    detectedRitual: {
      serviceName: 'Station Buffer & UV Sterilization',
      stylistName: 'Support Artisan',
      currentMilestone: 'Disinfectant Fogging & Basin Prep',
      detectedAt: '14:54',
      isHumanConfirmed: true,
    },
  },
  {
    id: 'SPA-VIP',
    name: 'Haute Suite Privée',
    room: 'Private VIP Pavilion',
    branchId: 'branch-banjara-sanctuary',
    type: 'spa',
    cameraStream: {
      status: 'online',
      fps: 20,
      resolution: '1080p @ 30fps',
      latencyMs: 36,
      rtspEndpoint: 'rtsp://edge-gw.banjara.glamoure.internal/live/vip_suite',
    },
    occupancy: {
      status: 'occupied',
      confidence: 97,
      elapsedMinutes: 52,
      estimatedTotalMinutes: 90,
    },
    detectedRitual: {
      serviceName: 'Royal Caviar Rejuvenation & Blowout',
      stylistName: 'Zara Al-Mansoor',
      currentMilestone: 'Infusion & Silk Styling Finish',
      detectedAt: '14:10',
      isHumanConfirmed: true,
    },
  },
  {
    id: 'GACH-01',
    name: 'Styling Station G1',
    room: 'Express Studio',
    branchId: 'branch-gachibowli-express',
    type: 'styling',
    cameraStream: {
      status: 'setup_required',
      fps: 0,
      resolution: 'Awaiting Gateway Handshake',
      latencyMs: 0,
      rtspEndpoint: 'rtsp://edge-gw.gachibowli.glamoure.internal/live/g1',
    },
    occupancy: {
      status: 'available',
      confidence: 100,
      elapsedMinutes: 0,
      estimatedTotalMinutes: 0,
    },
    detectedRitual: {
      serviceName: 'Hardware Gateway Disconnected',
      stylistName: 'Local Edge Server Offline',
      currentMilestone: 'Connect RTSP IP camera feed to start inference',
      detectedAt: '12:00',
      isHumanConfirmed: false,
    },
  },
];

export const OwnerLiveMonitorPage: React.FC = () => {
  const { isBranchMatch } = useBranch();
  const { showToast } = useNotification();

  const [stations, setStations] = useState<WorkstationStation[]>(INITIAL_WORKSTATIONS);
  const [selectedStation, setSelectedStation] = useState<WorkstationStation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Filtered by active branch from BranchContext
  const branchStations = useMemo(() => {
    return stations.filter(st => {
      const matchBranch = isBranchMatch(st.branchId);
      const matchType = filterType === 'all' || st.type === filterType;
      return matchBranch && matchType;
    });
  }, [stations, isBranchMatch, filterType]);

  // Telemetry aggregates
  const totalStations = branchStations.length;
  const occupiedCount = branchStations.filter(s => s.occupancy.status === 'occupied').length;
  const availableCount = branchStations.filter(s => s.occupancy.status === 'available').length;
  const bufferCount = branchStations.filter(s => s.occupancy.status === 'buffer').length;
  const unconfirmedEvents = branchStations.filter(s => !s.detectedRitual.isHumanConfirmed && s.occupancy.status === 'occupied').length;

  // Actions
  const handleConfirmAiEvent = (stationId: string) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          detectedRitual: { ...s.detectedRitual, isHumanConfirmed: true }
        };
      }
      return s;
    }));
    showToast('AI Event Confirmed', 'Staff confirmed computer vision milestone. Ground truth updated.');
  };

  const handleCorrectMilestone = (stationId: string) => {
    const newMilestone = prompt('Enter corrected service milestone (e.g. Scalp Massage or Final Styling):', 'Hair Finish & Styling');
    if (!newMilestone) return;

    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          detectedRitual: {
            ...s.detectedRitual,
            currentMilestone: newMilestone,
            isHumanConfirmed: true
          }
        };
      }
      return s;
    }));
    showToast('Milestone Corrected', `Workstation ${stationId} updated with human correction.`);
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER & REAL-TIME TELEMETRY
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6] flex items-center gap-2">
            Live Salon Monitor & Edge Vision
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              RTSP Gateway Live
            </span>
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Real-time physical chair occupancy, ritual milestone detection, and optical workstation flow.
          </p>
        </div>

        {/* Room / Station Filter */}
        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          {['all', 'styling', 'wash', 'color', 'spa'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          PRIVACY & ETHICS GUARANTEE BANNER
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#B99470] shrink-0" />
          <span className="text-[#41332B] dark:text-[#f5eee6]">
            <strong>Strict Privacy & Safety Protocol:</strong> Local edge inference only. Real-time dynamic face blurring is enabled. Zero facial recognition or biometric profiles stored. DPDP & GDPR Compliant.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] py-0 border-[#B99470]/60 text-[#B99470] shrink-0 self-start sm:self-center">
          Masking Active
        </Badge>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          METRICS STRIP
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Total Workstations</span>
          <p className="text-xl font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">{totalStations}</p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Chairs Occupied</span>
          <p className="text-xl font-light text-amber-600 dark:text-amber-400 mt-0.5">{occupiedCount}</p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Available Bays</span>
          <p className="text-xl font-light text-emerald-600 dark:text-emerald-400 mt-0.5">{availableCount}</p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Buffer / Sanitizing</span>
          <p className="text-xl font-light text-blue-600 dark:text-blue-400 mt-0.5">{bufferCount}</p>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          WORKSTATION CAMERA & INFERENCE GRID
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branchStations.map(station => {
          const isOnline = station.cameraStream.status === 'online';
          const isOccupied = station.occupancy.status === 'occupied';
          const isBuffer = station.occupancy.status === 'buffer';

          return (
            <Card
              key={station.id}
              className="bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] overflow-hidden flex flex-col transition-all hover:border-[#B99470]/60"
            >
              {/* Camera Simulated Viewport / Optical Stream Header */}
              <div className="relative aspect-video bg-[#18110e] border-b border-[#E8D8C7]/60 dark:border-[#3d2a21] flex flex-col justify-between p-3 overflow-hidden group">
                {/* Visual Camera Background / Edge Wireframe Grid */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#b99470_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Top Telemetry Overlay */}
                <div className="relative z-10 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono">
                    <Video className="w-3 h-3 text-[#B99470]" />
                    {station.id}
                  </span>
                  {isOnline ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      LIVE {station.cameraStream.fps} FPS • {station.cameraStream.latencyMs}ms
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/90 text-stone-400 font-mono">
                      <WifiOff className="w-3 h-3 text-stone-500" />
                      SETUP NEEDED
                    </span>
                  )}
                </div>

                {/* Center Inference Bounding Box Simulation */}
                <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
                  {isOnline ? (
                    <div className="space-y-1.5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${
                        isOccupied 
                          ? 'bg-amber-950/70 text-amber-200 border-amber-500/40' 
                          : isBuffer
                          ? 'bg-blue-950/70 text-blue-200 border-blue-500/40'
                          : 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                      }`}>
                        <Activity className="w-3 h-3" />
                        {station.occupancy.status.toUpperCase()} ({station.occupancy.confidence}% CONFIDENCE)
                      </div>
                      <p className="text-[11px] text-[#f5eee6]/80 font-mono">
                        {station.cameraStream.resolution}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 text-stone-400 text-xs text-center space-y-1">
                      <Cpu className="w-6 h-6 mx-auto text-stone-500 mb-1" />
                      <p className="font-medium text-stone-300">RTSP Stream Not Linked</p>
                      <p className="text-[10px] text-stone-500">Configure local stream endpoint in gateway</p>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay: Privacy Shield & Room */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-white/70">
                  <span>{station.room}</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#B99470]" />
                    Dynamic Masking Active
                  </span>
                </div>
              </div>

              {/* Station Details & Detected Ritual Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-[#41332B] dark:text-[#f5eee6]">{station.name}</h3>
                    <Badge variant="outline" className="text-[10px] border-[#E8D8C7] text-[#806B5C]">
                      {station.type.toUpperCase()}
                    </Badge>
                  </div>

                  {/* AI Milestone Telemetry */}
                  <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-[#806B5C] dark:text-[#a89582]">Detected Ritual</span>
                      <span className="text-[10px] text-[#806B5C]">Started {station.detectedRitual.detectedAt}</span>
                    </div>
                    <p className="font-medium text-[#41332B] dark:text-[#f5eee6] flex items-center gap-1.5">
                      <Scissors className="w-3 h-3 text-[#B99470]" />
                      {station.detectedRitual.serviceName}
                    </p>
                    <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">
                      Artisan: <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{station.detectedRitual.stylistName}</span>
                    </p>
                    <div className="pt-1.5 border-t border-[#E8D8C7]/50 dark:border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-[#806B5C]">Milestone:</span>
                      <span className="font-medium text-[#41332B] dark:text-[#f5eee6] truncate max-w-[170px]">{station.detectedRitual.currentMilestone}</span>
                    </div>
                  </div>
                </div>

                {/* Human Confirmation / Correction Bar */}
                {isOccupied && (
                  <div className="pt-2 border-t border-[#E8D8C7]/60 dark:border-[#3d2a21] flex items-center justify-between gap-2">
                    {station.detectedRitual.isHumanConfirmed ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Staff Confirmed
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmAiEvent(station.id)}
                        className="text-[11px] px-2.5 py-1 bg-[#41332B] text-white hover:bg-[#2b1810]"
                      >
                        Confirm AI Event
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCorrectMilestone(station.id)}
                      className="text-[11px] px-2 py-1 border-[#E8D8C7] dark:border-white/10 text-[#806B5C] hover:text-[#41332B]"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Correct
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          CHRONOLOGICAL AI COMPUTER VISION EVENT STREAM
      ═════════════════════════════════════════════════════════════════════ */}
      <Card className="p-4 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <h3 className="font-['Montserrat'] text-sm font-medium text-[#41332B] dark:text-[#f5eee6] mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#B99470]" />
          Real-time Edge Vision Event Stream
        </h3>
        <div className="space-y-2 text-xs divide-y divide-[#E8D8C7]/40 dark:divide-white/5">
          {[
            { time: '14:54', bay: 'Wash Basin 02', event: 'Station transitioned to buffer state for UV sanitation fogging', conf: '98%' },
            { time: '14:46', bay: 'Wash Basin 01', event: 'Guest seated. Ozone Scalp Exfoliation detected via head positioning', conf: '91%' },
            { time: '14:32', bay: 'Mirror Bay 01', event: 'Artisan Elena Vance initiated foil sectioning on customer chair', conf: '96%' },
            { time: '14:15', bay: 'Color Lab 01', event: 'Marcus Reed applied gloss emulsion glaze (Elapsed: 44m)', conf: '94%' },
          ].map((evt, idx) => (
            <div key={idx} className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#806B5C]">{evt.time}</span>
                <Badge variant="outline" className="text-[10px] border-[#E8D8C7] text-[#41332B] dark:text-[#f5eee6]">
                  {evt.bay}
                </Badge>
                <span className="text-[#806B5C] dark:text-[#a89582]">{evt.event}</span>
              </div>
              <span className="text-[10px] font-mono text-[#B99470] shrink-0">{evt.conf} conf</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
