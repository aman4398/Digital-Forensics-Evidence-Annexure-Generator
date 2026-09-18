import React, { useState } from 'react';
import { Device, Premise, DeviceCategory } from '../types';
import { 
  Laptop, 
  Smartphone, 
  HardDrive, 
  Server, 
  Cloud, 
  FolderArchive, 
  Tv, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Edit3, 
  FileText, 
  ShieldCheck, 
  Hash,
  Sparkles,
  Layers,
  Building2
} from 'lucide-react';

interface Props {
  premise: Premise;
  devices: Device[];
  onOpenNewDevice: () => void;
  onEditDevice: (device: Device) => void;
  onDuplicateDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
  onSelectDocumentForDevice: (device: Device) => void;
  onGenerateReports?: () => void;
}

export const DeviceManager: React.FC<Props> = ({
  premise,
  devices,
  onOpenNewDevice,
  onEditDevice,
  onDuplicateDevice,
  onDeleteDevice,
  onSelectDocumentForDevice,
  onGenerateReports,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  if (!premise) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">No Premise Selected</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Please create and save a search premise first before logging evidence devices.
        </p>
      </div>
    );
  }

  const filteredDevices = devices.filter(dev => {
    const matchesSearch = 
      dev.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.ownerUserName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'ALL' || dev.deviceCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: DeviceCategory) => {
    switch (category) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'desktop':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'dvr':
        return <Tv className="w-5 h-5 text-amber-400" />;
      case 'file_folder':
        return <FolderArchive className="w-5 h-5 text-orange-400" />;
      default:
        return <HardDrive className="w-5 h-5 text-purple-400" />;
    }
  };

  const laptopsCount = devices.filter(d => d.deviceCategory === 'laptop' || d.deviceCategory === 'desktop').length;
  const mobilesCount = devices.filter(d => d.deviceCategory === 'mobile').length;
  const cloudCount = devices.filter(d => d.deviceCategory === 'cloud').length;
  const otherCount = devices.length - laptopsCount - mobilesCount - cloudCount;

  return (
    <div className="space-y-6">
      {/* STATS & ACTION HEADER (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Evidence Ledger &bull; {premise.code}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Digital Evidence Devices at this Premise ({devices.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record hardware specs, target media, cryptographic hashes &amp; chain of custody. Generate statutory annexures once logging is complete.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewDevice}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Device Details</span>
            </button>

            {devices.length > 0 && onGenerateReports && (
              <button
                onClick={onGenerateReports}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors text-xs"
                title="Generate complete court dossier and Annexures A to G"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Statutory Reports &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-600 font-medium">Laptops / Desktops</div>
            <div className="text-xl font-bold text-blue-700 mt-0.5">{laptopsCount}</div>
            <div className="text-[10px] text-slate-500">Annexure B target</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-600 font-medium">Mobile Phones</div>
            <div className="text-xl font-bold text-indigo-700 mt-0.5">{mobilesCount}</div>
            <div className="text-[10px] text-slate-500">Annexure D target</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-600 font-medium">Cloud / Email Archives</div>
            <div className="text-xl font-bold text-sky-700 mt-0.5">{cloudCount}</div>
            <div className="text-[10px] text-slate-500">Annexure F target</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-600 font-medium">Storage / Drives / Other</div>
            <div className="text-xl font-bold text-purple-700 mt-0.5">{otherCount}</div>
            <div className="text-[10px] text-slate-500">Total: {devices.length} devices</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by device name, serial number, make, user..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        >
          <option value="ALL">All Categories ({devices.length})</option>
          <option value="laptop">Laptops</option>
          <option value="mobile">Mobiles</option>
          <option value="desktop">Desktops</option>
          <option value="storage">Storage Media</option>
          <option value="cloud">Cloud Evidences</option>
          <option value="server">Servers</option>
        </select>
      </div>

      {/* DEVICE CARDS LIST */}
      {filteredDevices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
          <Laptop className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No digital devices matching criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {devices.length === 0 
              ? `No devices have been logged for ${premise.code} yet. Click "Add Digital Device" to log your first piece of digital evidence.`
              : 'Try clearing your search query or changing the category filter.'}
          </p>
          {devices.length === 0 && (
            <button
              onClick={onOpenNewDevice}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Evidence Device</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDevices.map(device => {
            const hasMobile = device.deviceCategory === 'mobile';
            return (
              <div
                key={device.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs hover:shadow transition-all flex flex-col justify-between"
              >
                <div>
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                        {getCategoryIcon(device.deviceCategory)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {device.deviceCategory}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            device.deviceHandling === 'IMAGING' 
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : device.deviceHandling === 'SEIZURE'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {device.deviceHandling}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {device.deviceName}
                        </h4>
                        <div className="text-xs text-slate-500">
                          {device.make} {device.model} &bull; <span className="font-mono text-slate-700 font-medium">{device.storageCapacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    {device.deviceCategory === 'cloud' ? (
                      <>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Image Size</span>
                          <span className="text-sky-700 font-bold truncate block">
                            {device.imageSize || device.storageCapacity || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Owner / User</span>
                          <span className="text-slate-800 truncate block font-semibold">
                            {device.ownerUserName || 'Assessee Mailbox'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Backup Method</span>
                          <span className="text-slate-700 truncate block text-[11px]">
                            {device.backupMethod || device.cloudJobSheet?.backupMethod || 'Google Takeout / MBOX / AD1'}
                          </span>
                        </div>
                      </>
                    ) : device.deviceCategory === 'file_folder' ? (
                      <>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Size of Data</span>
                          <span className="text-orange-700 font-bold truncate block">
                            {device.dataSize || device.storageCapacity || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Image Size</span>
                          <span className="text-slate-800 font-bold truncate block">
                            {device.imageSize || device.storageCapacity || '—'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Custodian / User</span>
                          <span className="text-slate-800 truncate block">
                            {device.ownerUserName || 'Staff / Accountant'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Serial Number</span>
                          <span className="font-mono text-slate-800 truncate block font-medium">
                            {device.serialNumber || 'N/A'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Owner / User</span>
                          <span className="text-slate-800 truncate block font-semibold">
                            {device.ownerUserName} {device.relationWithTarget ? `(${device.relationWithTarget})` : ''}
                          </span>
                        </div>
                      </>
                    )}

                    {hasMobile && device.mobileDetails && (
                      <div className="col-span-2 p-2 bg-indigo-50/60 rounded border border-indigo-100 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-semibold text-indigo-900">IMEI-1:</span>
                          <span className="font-mono font-bold text-indigo-800">{device.mobileDetails.imei1 || '—'}</span>
                        </div>
                        {device.mobileDetails.imei2 && (
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                            <span className="font-semibold text-indigo-900">IMEI-2:</span>
                            <span className="font-mono text-indigo-800">{device.mobileDetails.imei2}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-semibold text-indigo-900">SIM Details:</span>
                          <span className="text-slate-700 font-medium">
                            {device.mobileDetails.simPresent === 'YES' 
                              ? (device.mobileDetails.simProvider || 'SIM Inserted') 
                              : 'No SIM'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Master & Working Copies Info */}
                    <div className="col-span-2 pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10.5px] text-slate-600">
                      <div className="truncate max-w-[48%]">
                        <span className="font-semibold text-amber-800">Master:</span>{' '}
                        <span>
                          {device.masterCopies && device.masterCopies.length > 1 
                            ? `${device.masterCopies.length} Drives (${device.masterCopies[0]?.make || 'HDD'})` 
                            : `${device.masterCopy?.make || 'Seagate'} ${device.masterCopy?.storageCapacity || ''}`}
                        </span>
                      </div>
                      <div className="truncate max-w-[48%] text-right">
                        <span className="font-semibold text-blue-800">Working:</span>{' '}
                        <span>
                          {device.workingCopies && device.workingCopies.length > 1 
                            ? `${device.workingCopies.length} Drives (${device.workingCopies[0]?.make || 'WD'})` 
                            : `${device.workingCopy?.make || 'WD'} ${device.workingCopy?.storageCapacity || ''}`}
                        </span>
                      </div>
                    </div>

                    {/* FORENSIC HASH VALUE & CUSTODY STATUS */}
                    <div className="col-span-2 pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="flex items-center justify-between text-[10.5px] mb-1">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Hash className="w-3 h-3 text-emerald-600" />
                            <span>SHA-256 Hash Checksum:</span>
                          </span>
                          {device.sha256Hash1 ? (
                            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-medium">Pending</span>
                          )}
                        </div>
                        <div className="font-mono text-[10.5px] text-slate-800 break-all select-all">
                          {device.sha256Hash1 || (device.md5Hash ? `MD5: ${device.md5Hash}` : 'Hash calculation pending')}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                        <span className="flex items-center gap-1 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Custody Log:</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {device.chainOfCustody && device.chainOfCustody.length > 0 
                            ? `${device.chainOfCustody.length} Handover${device.chainOfCustody.length > 1 ? 's' : ''} Logged` 
                            : 'Initial Seizure Logged'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD ACTIONS */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDocumentForDevice(device)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md border border-blue-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Annexures</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditDevice(device)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Edit device details, hashes & custody"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicateDevice(device)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Duplicate device specs"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${device.deviceName}"?`)) {
                          onDeleteDevice(device.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM GENERATE REPORT ACTION BANNER */}
      {devices.length > 0 && onGenerateReports && (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence Ledger &amp; Hashes Complete</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Ready to Generate Statutory Forensic Dossier &amp; Annexures A to G
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              All device hardware details, target media physical copies, SHA-256/MD5 hashes, and chain of custody logs are saved for {premise.code}.
            </p>
          </div>

          <button
            onClick={onGenerateReports}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg shadow-lg transition-all text-sm shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Statutory Reports &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};
