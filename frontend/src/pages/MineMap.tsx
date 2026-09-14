import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../api/client';
import { Mine } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  MapPin,
  Filter,
  Eye,
  Mountain,
  ShieldCheck,
  AlertOctagon,
  Layers,
  ChevronRight
} from 'lucide-react';

// Custom colored SVG pin markers
const createCustomIcon = (riskLevel: string) => {
  const color = riskLevel === 'CRITICAL' ? '#e11d48' : riskLevel === 'HIGH' ? '#f97316' : riskLevel === 'MEDIUM' ? '#eab308' : '#10b981';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

import { MOCK_MINES } from '../data/mockData';

export const MineMap: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightMineId = searchParams.get('mineId');

  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedMine, setSelectedMine] = useState<Mine | null>(MOCK_MINES[0]);

  const fetchMines = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setMines(res.data.data);
        if (highlightMineId) {
          const found = res.data.data.find((m: Mine) => m.id === highlightMineId);
          if (found) setSelectedMine(found);
        }
      }
    } catch (err) {
      console.warn('Using pre-seeded mines for GIS Map');
    }
  };

  useEffect(() => {
    fetchMines();
  }, []);

  const filteredMines = React.useMemo(() => {
    return mines.filter(m => {
      if (search && search.trim()) {
        const tokens = search.toLowerCase().trim().split(/\s+/);
        const haystack = `${m.name || ''} ${m.code || ''} ${m.owner || ''} ${m.district || ''} ${m.state || ''} ${m.location || ''} ${m.type || ''} ${m.riskLevel || ''}`.toLowerCase();
        const allMatched = tokens.every((tok) => haystack.includes(tok));
        if (!allMatched) return false;
      }
      if (riskFilter && riskFilter.trim()) {
        if ((m.riskLevel || '').toUpperCase().trim() !== riskFilter.toUpperCase().trim()) return false;
      }
      if (stateFilter && stateFilter.trim()) {
        if ((m.state || '').toLowerCase().trim() !== stateFilter.toLowerCase().trim()) return false;
      }
      if (typeFilter && typeFilter.trim()) {
        if ((m.type || '').toUpperCase().trim() !== typeFilter.toUpperCase().trim()) return false;
      }
      return true;
    });
  }, [mines, search, riskFilter, stateFilter, typeFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setRiskFilter('');
    setStateFilter('');
    setTypeFilter('');
  };

  const hasActiveFilters = Boolean(search || riskFilter || stateFilter || typeFilter);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Interactive National GIS Coalfields Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial statutory risk surveillance across Indian coalfields with real-time health pins.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs font-semibold">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Critical</span>
        </div>
      </div>

      {/* Main Map Container + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[680px]">
        
        {/* Left Side: Colliery Quick Selector */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-full overflow-hidden">
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gov-primary" />
                Colliery Filter
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Search colliery, state, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gov-primary"
            />

            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-none"
              >
                <option value="">All Risk Levels</option>
                <option value="CRITICAL">🔴 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low / Safe</option>
              </select>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-none"
              >
                <option value="">All States</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Odisha">Odisha</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Telangana">Telangana</option>
                <option value="Assam">Assam</option>
              </select>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap gap-1 pt-1">
              <button
                onClick={() => { setRiskFilter(''); setStateFilter(''); setTypeFilter(''); }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  !hasActiveFilters ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({mines.length})
              </button>
              <button
                onClick={() => setRiskFilter('CRITICAL')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  riskFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setRiskFilter('HIGH')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  riskFilter === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                High Risk
              </button>
              <button
                onClick={() => setRiskFilter('LOW')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Compliant
              </button>
            </div>

            <div className="text-[10px] font-bold text-slate-500 pt-0.5 flex items-center justify-between">
              <span>Showing {filteredMines.length} of {mines.length} collieries</span>
              {hasActiveFilters && <span className="text-gov-primary">Filtered</span>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMines.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMine(m)}
                className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedMine?.id === m.id
                    ? 'border-gov-primary bg-gov-primary/5 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-gov-primary bg-gov-primary/10 px-1 rounded">
                      {m.code}
                    </span>
                    <p className="font-bold text-slate-900 mt-1">{m.name}</p>
                    <p className="text-[11px] text-slate-500">{m.district}, {m.state}</p>
                  </div>
                  <StatusBadge status={m.riskLevel} type="risk" />
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Score: <strong className="text-slate-800">{m.complianceScore}%</strong></span>
                  <span className="text-gov-primary font-bold hover:underline flex items-center gap-0.5">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Leaflet Map */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden relative h-full">
          <MapContainer
            center={[22.5, 82.5]}
            zoom={5}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredMines.map((m) => (
              <Marker
                key={m.id}
                position={[m.latitude, m.longitude]}
                icon={createCustomIcon(m.riskLevel)}
                eventHandlers={{
                  click: () => setSelectedMine(m)
                }}
              >
                <Popup>
                  <div className="p-1 max-w-[220px] font-sans">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-gov-primary px-1 rounded">
                        {m.code}
                      </span>
                      <StatusBadge status={m.riskLevel} type="risk" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{m.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{m.owner}</p>
                    <p className="text-[10px] text-slate-500">{m.location}</p>

                    <div className="my-2 py-1.5 border-y border-slate-200 grid grid-cols-2 gap-1 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Compliance:</span>
                        <strong className="text-slate-800 font-bold">{m.complianceScore}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Type:</span>
                        <strong className="text-slate-800">{m.type}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/mines/${m.id}`)}
                      className="w-full mt-1 px-2 py-1 bg-gov-primary text-white text-[11px] font-bold rounded hover:bg-gov-dark transition-colors text-center"
                    >
                      Open Colliery Profile →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default MineMap;

