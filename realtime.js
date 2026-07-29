/* ═══════════════════════════════════════════════════════════════════════════
   GIRGUARD AI — REAL-TIME TELEMETRY & OFFICER AUTHENTICATION ENGINE
   Live Leaflet GIS tracking, sound synthesizer, and Officer Login System
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // State Management
  const state = {
    audioEnabled: true,
    currentUser: {
      name: 'R.K. Jadeja',
      role: 'Chief Forest Officer',
      initials: 'RK',
      authenticated: true
    },
    animals: [
      { id: 'GIR-07', name: 'Male Asiatic Lion', lat: 21.1325, lng: 70.5284, village: 'Sasan', dist: 1.2, speed: 4.8, batt: 84, status: 'CRITICAL', icon: 'fa-paw', color: '#dc2626' },
      { id: 'LEP-03', name: 'Adult Leopard', lat: 21.1982, lng: 70.4412, village: 'Maliya', dist: 0.8, speed: 2.1, batt: 92, status: 'HIGH', icon: 'fa-cat', color: '#d97706' },
      { id: 'GIR-02', name: 'Lion Pride (3)', lat: 21.1641, lng: 70.7820, village: 'Dhari', dist: 2.4, speed: 3.2, batt: 78, status: 'HIGH', icon: 'fa-paw', color: '#d97706' },
      { id: 'GIR-14', name: 'Male Asiatic Lion', lat: 21.2810, lng: 70.6120, village: 'Visavadar', dist: 3.1, speed: 1.5, batt: 95, status: 'MEDIUM', icon: 'fa-paw', color: '#0284c7' }
    ],
    teams: [
      { id: 'RT1', name: 'Rapid Response Alpha', lead: 'D.K. Jadeja', base: 'Sasan HQ', status: 'ACTIVE', eta: '4 min 20s', lat: 21.1400, lng: 70.5200 },
      { id: 'RT2', name: 'Rapid Response Beta', lead: 'M. Solanki', base: 'Maliya Base', status: 'EN ROUTE', eta: '9 min 15s', lat: 21.1900, lng: 70.4500 },
      { id: 'RT3', name: 'Wildlife Rescue Gamma', lead: 'P. Thakor', base: 'Dhari Base', status: 'STANDBY', eta: 'Ready', lat: 21.1600, lng: 70.7700 }
    ]
  };

  let mapInstance = null;
  let animalMarkers = {};
  let teamMarkers = {};

  // Audio Alert Synthesizer
  function playAlertSound(freq = 880, type = 'sine') {
    if (!state.audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio Context restricted:', e);
    }
  }

  // Restore Officer Login State from localStorage
  function loadOfficerSession() {
    const saved = localStorage.getItem('girguard_user');
    if (saved) {
      try {
        state.currentUser = JSON.parse(saved);
      } catch (e) {
        console.error('Session load error', e);
      }
    }
    renderUserBadge();
  }

  // Update Navbar User Profile
  function renderUserBadge() {
    const userBadges = document.querySelectorAll('.user-profile');
    userBadges.forEach(el => {
      if (!state.currentUser.authenticated) {
        el.innerHTML = `
          <button class="btn btn-primary btn-sm" onclick="openLoginModal()">
            <i class="fa-solid fa-user-shield"></i> Officer Login
          </button>
        `;
      } else {
        el.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="openLoginModal()" title="Click to switch officer role / logout">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--wf-green-dark);color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid var(--wf-green-light);">
              ${state.currentUser.initials}
            </div>
            <div style="font-size:12px;line-height:1.2;">
              <div style="font-weight:700;color:var(--wf-text-dark);">${state.currentUser.name}</div>
              <div style="color:var(--wf-text-muted);font-size:10px;">${state.currentUser.role}</div>
            </div>
          </div>
        `;
      }
    });
  }

  // Initialize Leaflet GIS Map
  function initLeafletMap() {
    const mapEl = document.getElementById('command-map');
    if (!mapEl || typeof L === 'undefined') return;

    mapInstance = L.map('command-map', {
      center: [21.1350, 70.5400],
      zoom: 11,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Gir Forest Division',
      maxZoom: 19
    }).addTo(mapInstance);

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 400);

    // Render Villages
    const villages = [
      { name: 'Sasan Village', coords: [21.1450, 70.5220], radius: 2000, color: '#dc2626' },
      { name: 'Maliya Hatina', coords: [21.2050, 70.4350], radius: 1800, color: '#d97706' },
      { name: 'Dhari Edge', coords: [21.1550, 70.7950], radius: 1500, color: '#d97706' }
    ];

    villages.forEach(v => {
      L.circle(v.coords, {
        color: v.color,
        fillColor: v.color,
        fillOpacity: 0.1,
        radius: v.radius
      }).addTo(mapInstance).bindPopup(`<b>${v.name}</b><br>Buffer Security Zone`);
    });

    // Render Animals
    state.animals.forEach(a => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background:${a.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;box-shadow:0 0 12px ${a.color};border:2px solid #fff;">
                <i class="fa-solid ${a.icon}"></i>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([a.lat, a.lng], { icon: customIcon }).addTo(mapInstance);
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:12px;">
          <b style="color:${a.color};font-size:14px;">${a.id} — ${a.name}</b><br>
          Near: <b>${a.village}</b> (${a.dist} km)<br>
          Speed: ${a.speed} km/h | Batt: ${a.batt}%<br>
          <span style="color:#dc2626;font-weight:bold;">Status: ${a.status}</span>
        </div>
      `);
      animalMarkers[a.id] = marker;
    });
  }

  // Simulation Step
  function stepSimulation() {
    state.animals.forEach(a => {
      const dLat = (Math.random() - 0.48) * 0.0005;
      const dLng = (Math.random() - 0.48) * 0.0005;
      a.lat += dLat;
      a.lng += dLng;
      a.speed = (Math.max(0.5, a.speed + (Math.random() - 0.5) * 0.4)).toFixed(1);
      a.dist = (Math.max(0.3, a.dist + (Math.random() - 0.5) * 0.05)).toFixed(1);

      if (animalMarkers[a.id]) {
        animalMarkers[a.id].setLatLng([a.lat, a.lng]);
      }
    });

    updateTelemetryDOM();
  }

  function updateTelemetryDOM() {
    const gir07Speed = document.getElementById('gir07-speed');
    const gir07Dist = document.getElementById('gir07-dist');
    const gir07Lat = document.getElementById('gir07-lat');
    const gir07Lng = document.getElementById('gir07-lng');

    const gir07 = state.animals.find(x => x.id === 'GIR-07');
    if (gir07) {
      if (gir07Speed) gir07Speed.textContent = `${gir07.speed} km/h`;
      if (gir07Dist) gir07Dist.textContent = `${gir07.dist} km`;
      if (gir07Lat) gir07Lat.textContent = gir07.lat.toFixed(4);
      if (gir07Lng) gir07Lng.textContent = gir07.lng.toFixed(4);
    }
  }

  // Toast Notification
  window.triggerAlertToast = function (title, msg, type = 'critical') {
    playAlertSound(1040, 'triangle');
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #ffffff;
      border-left: 5px solid ${type === 'critical' ? '#dc2626' : '#d97706'};
      color: #0f172a;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      animation: slideIn 0.3s ease;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    `;
    toast.innerHTML = `
      <div style="font-size:24px;color:${type === 'critical' ? '#dc2626' : '#d97706'};"><i class="fa-solid fa-bell"></i></div>
      <div>
        <div style="font-weight:700;font-size:14px;">${title}</div>
        <div style="font-size:12px;color:#64748b;">${msg}</div>
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;margin-left:12px;">&times;</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
  };

  // Dispatch Modal Controls
  window.openDispatchModal = function () {
    const modal = document.getElementById('dispatch-modal');
    if (modal) modal.classList.add('active');
  };

  window.closeDispatchModal = function () {
    const modal = document.getElementById('dispatch-modal');
    if (modal) modal.classList.remove('active');
  };

  window.submitDispatchForm = function (e) {
    if (e) e.preventDefault();
    closeDispatchModal();
    triggerAlertToast('RESCUE TEAM DISPATCHED', 'Rapid Response unit authorized and en route.', 'warning');
  };

  // LOGIN MODAL CONTROLS & AUTHENTICATION
  window.openLoginModal = function () {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('active');
  };

  window.closeLoginModal = function () {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('active');
  };

  window.submitLoginForm = function (e) {
    if (e) e.preventDefault();
    const roleSelect = document.getElementById('login-role');
    const nameInput = document.getElementById('login-name');

    const selectedRole = roleSelect ? roleSelect.value : 'Chief Forest Officer';
    const nameVal = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'R.K. Jadeja';

    const parts = nameVal.split(' ');
    const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : nameVal.slice(0, 2).toUpperCase();

    state.currentUser = {
      name: nameVal,
      role: selectedRole,
      initials: initials,
      authenticated: true
    };

    localStorage.setItem('girguard_user', JSON.stringify(state.currentUser));
    renderUserBadge();
    closeLoginModal();
    triggerAlertToast('OFFICER AUTHENTICATED', `Welcome ${state.currentUser.name} (${state.currentUser.role})`, 'warning');
  };

  window.logoutOfficer = function () {
    state.currentUser = { name: '', role: '', initials: '', authenticated: false };
    localStorage.removeItem('girguard_user');
    renderUserBadge();
    closeLoginModal();
    triggerAlertToast('OFFICER LOGGED OUT', 'Successfully signed out from command session.', 'warning');
  };

  window.triggerSirenBroadcast = function () {
    triggerAlertToast('VILLAGE SIREN BROADCAST', 'Automated siren warning activated in Sasan & Maliya.', 'critical');
  };

  window.simulateStrayingLion = function () {
    triggerAlertToast('NEW CRITICAL SIGHTING', 'GPS Collar #GIR-14 detected near Visavadar perimeter!', 'critical');
  };

  // DOM Loaded Listener
  document.addEventListener('DOMContentLoaded', () => {
    loadOfficerSession();
    initLeafletMap();
    setInterval(stepSimulation, 2000);

    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        audioBtn.innerHTML = state.audioEnabled 
          ? '<i class="fa-solid fa-volume-high"></i> Audio ON' 
          : '<i class="fa-solid fa-volume-xmark"></i> Muted';
      });
    }
  });

})();
