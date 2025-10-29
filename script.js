// Global inventions data
let inventionsData = [];
let dataLoaded = false;

// Load inventions from JSON
async function loadInventions() {
    try {
        const response = await fetch('inventions.json');
        if (response.ok) {
            inventionsData = await response.json();
            dataLoaded = true;
            console.log(`Loaded ${inventionsData.length} inventions from JSON`);
        } else {
            console.log('Could not load inventions.json, using mock data');
            inventionsData = getMockData();
            dataLoaded = true;
        }
    } catch (error) {
        console.log('Error loading JSON, using mock data:', error);
        inventionsData = getMockData();
        dataLoaded = true;
    }
    
    // Update timeline range based on loaded data
    if (inventionsData.length > 0) {
        const dates = inventionsData.map(inv => inv.date);
        timeline.start = Math.min(...dates);
        timeline.end = Math.max(...dates);
        timeline.current = timeline.start;
    }
    
    // Initialize after data is loaded
    initMap();
    handleScroll();
}

// Mock data fallback
function getMockData() {
    return [
        { name: "Stone Tools", date: -3300000, lat: -1.2921, lng: 36.8219, location: "Kenya", description: "First stone tools created by early hominids" },
        { name: "Control of Fire", date: -2300000, lat: 9.1450, lng: 40.4897, location: "Ethiopia", description: "Earliest evidence of controlled fire use" },
        { name: "Agriculture", date: -10000, lat: 36.0, lng: 38.0, location: "Fertile Crescent", description: "Beginning of systematic agriculture" },
        { name: "Pottery", date: -18000, lat: 35.0, lng: 105.0, location: "China", description: "First pottery vessels created" },
        { name: "Wheel", date: -3500, lat: 33.0, lng: 44.0, location: "Mesopotamia", description: "Invention of the wheel for transportation" },
        { name: "Writing", date: -3200, lat: 31.0, lng: 46.0, location: "Sumer", description: "Cuneiform writing system developed" },
        { name: "Bronze", date: -3300, lat: 36.0, lng: 38.0, location: "Near East", description: "Bronze metallurgy begins" },
        { name: "Pyramids", date: -2580, lat: 29.9792, lng: 31.1342, location: "Egypt", description: "Great Pyramid of Giza constructed" },
        { name: "Iron Tools", date: -1200, lat: 38.0, lng: 35.0, location: "Anatolia", description: "Iron Age begins" },
        { name: "Alphabet", date: -1050, lat: 33.8547, lng: 35.8623, location: "Phoenicia", description: "Phoenician alphabet developed" },
        { name: "Paper", date: -105, lat: 34.0, lng: 108.0, location: "China", description: "Paper invented in Han Dynasty" },
        { name: "Printing Press", date: 1440, lat: 50.0, lng: 8.5, location: "Germany", description: "Gutenberg invents movable type printing" },
        { name: "Steam Engine", date: 1712, lat: 52.5, lng: -2.0, location: "England", description: "First practical steam engine" },
        { name: "Electricity", date: 1752, lat: 39.9526, lng: -75.1652, location: "Philadelphia", description: "Benjamin Franklin's kite experiment" },
        { name: "Telephone", date: 1876, lat: 42.3601, lng: -71.0589, location: "Boston", description: "Alexander Graham Bell invents telephone" },
        { name: "Light Bulb", date: 1879, lat: 40.7128, lng: -74.0060, location: "New York", description: "Edison perfects incandescent light bulb" },
        { name: "Airplane", date: 1903, lat: 36.0, lng: -75.7, location: "North Carolina", description: "Wright brothers' first powered flight" },
        { name: "Penicillin", date: 1928, lat: 51.5074, lng: -0.1278, location: "London", description: "Fleming discovers penicillin" },
        { name: "Computer", date: 1946, lat: 39.9526, lng: -75.1652, location: "Philadelphia", description: "ENIAC, first electronic computer" },
        { name: "Internet", date: 1969, lat: 34.0522, lng: -118.2437, location: "California", description: "ARPANET first message sent" },
        { name: "World Wide Web", date: 1989, lat: 46.2044, lng: 6.1432, location: "Switzerland", description: "Tim Berners-Lee invents the Web" }
    ];
}

// Timeline configuration
const timeline = {
    start: -3500000, // 3.5 million years ago
    end: 2024,
    current: -3500000
};

// Convert lat/lng to SVG coordinates (updated for 2000x1000 viewBox)
function latLngToSvg(lat, lng) {
    const x = ((lng + 180) / 360) * 2000;
    const y = ((90 - lat) / 180) * 1000;
    return { x, y };
}

// Convert year to scroll position
function yearToScroll(year) {
    const range = timeline.end - timeline.start;
    const position = (year - timeline.start) / range;
    return position;
}

// Convert scroll position to year
function scrollToYear(scrollPercent) {
    const range = timeline.end - timeline.start;
    return timeline.start + (scrollPercent * range);
}

// Format date for display
function formatDate(year) {
    if (year < -999999) {
        return `${Math.abs(year / 1000000).toFixed(1)} Million Years Ago`;
    } else if (year < -9999) {
        return `${Math.abs(year / 1000).toFixed(0)} Thousand Years Ago`;
    } else if (year < 0) {
        return `${Math.abs(year)} BCE`;
    } else if (year < 1000) {
        return `${year} CE`;
    } else {
        return `${year}`;
    }
}

// Initialize the map
function initMap() {
    const svg = document.getElementById('worldMap');
    const mapBg = document.getElementById('mapBackground');
    
    // Draw more detailed world map outline (updated for 2000x1000 viewBox)
    const continents = [
        // North America - Canada
        {d: 'M 300 240 Q 350 200 420 220 Q 480 240 520 260 L 560 280 Q 580 300 590 320 L 600 350 Q 605 380 600 410 L 590 440 Q 570 460 540 470 L 500 480 Q 450 485 400 475 L 360 460 Q 330 440 310 410 L 295 370 Q 290 330 295 290 L 300 260 Z', name: 'North America'},
        
        // USA
        {d: 'M 310 440 Q 340 430 380 435 L 430 445 Q 480 455 520 470 L 560 490 Q 590 510 600 540 L 605 570 Q 600 600 580 620 L 550 635 Q 510 645 470 640 L 420 630 Q 370 615 330 590 L 310 570 Q 300 540 305 510 L 310 470 Z', name: 'USA'},
        
        // Mexico & Central America
        {d: 'M 350 620 Q 380 610 410 615 L 440 625 Q 460 640 465 665 L 468 690 Q 465 710 455 725 L 440 735 Q 420 740 400 735 L 375 725 Q 360 710 355 690 L 352 665 Q 353 640 358 625 Z', name: 'Central America'},
        
        // South America
        {d: 'M 450 720 Q 480 710 510 715 L 540 730 Q 565 750 575 780 L 585 820 Q 590 870 585 920 L 575 970 Q 560 1000 540 1020 L 510 1035 Q 475 1045 440 1035 L 410 1020 Q 385 1000 375 970 L 365 920 Q 360 870 365 820 L 375 770 Q 390 740 415 725 L 435 715 Z', name: 'South America'},
        
        // Europe - Scandinavia
        {d: 'M 1050 220 Q 1070 200 1095 205 L 1120 220 Q 1135 245 1130 270 L 1120 290 Q 1105 305 1085 300 L 1065 290 Q 1055 270 1055 245 Z', name: 'Scandinavia'},
        
        // Europe - Western
        {d: 'M 980 290 Q 1010 280 1040 285 L 1075 300 Q 1095 320 1095 345 L 1090 370 Q 1080 390 1060 395 L 1030 397 Q 1000 392 975 380 L 960 365 Q 955 340 960 315 L 970 295 Z', name: 'Western Europe'},
        
        // Europe - Eastern
        {d: 'M 1100 300 Q 1140 290 1180 300 L 1220 320 Q 1245 345 1245 375 L 1240 405 Q 1230 430 1210 440 L 1180 445 Q 1145 442 1115 430 L 1095 415 Q 1085 390 1090 360 L 1095 330 Z', name: 'Eastern Europe'},
        
        // Africa - North
        {d: 'M 980 450 Q 1030 440 1080 450 L 1140 470 Q 1180 490 1200 520 L 1210 550 Q 1210 580 1200 610 L 1185 635 Q 1160 650 1130 655 L 1080 657 Q 1030 652 990 640 L 960 625 Q 945 600 945 570 L 948 540 Q 955 510 970 485 L 985 465 Z', name: 'North Africa'},
        
        // Africa - Central & South
        {d: 'M 1000 660 Q 1050 650 1100 660 L 1150 680 Q 1185 710 1200 750 L 1210 800 Q 1210 850 1200 890 L 1185 925 Q 1165 950 1140 965 L 1100 980 Q 1050 985 1000 975 L 960 960 Q 930 935 920 900 L 910 850 Q 910 800 920 760 L 935 720 Q 955 690 980 675 Z', name: 'Central Africa'},
        
        // Middle East
        {d: 'M 1200 420 Q 1240 410 1280 420 L 1315 440 Q 1335 465 1335 495 L 1330 525 Q 1320 550 1300 560 L 1270 565 Q 1235 560 1210 545 L 1195 525 Q 1190 495 1195 465 L 1202 440 Z', name: 'Middle East'},
        
        // India
        {d: 'M 1420 520 Q 1460 510 1500 520 L 1535 545 Q 1555 575 1555 610 L 1550 650 Q 1540 685 1520 710 L 1495 730 Q 1465 740 1435 735 L 1405 720 Q 1385 695 1380 665 L 1377 620 Q 1382 580 1395 550 L 1410 530 Z', name: 'India'},
        
        // China
        {d: 'M 1550 300 Q 1610 285 1670 295 L 1730 315 Q 1770 340 1790 375 L 1800 415 Q 1800 460 1790 500 L 1775 535 Q 1750 560 1720 570 L 1670 575 Q 1610 570 1560 555 L 1525 535 Q 1505 510 1500 480 L 1497 440 Q 1502 400 1520 365 L 1540 330 Z', name: 'China'},
        
        // Southeast Asia
        {d: 'M 1580 580 Q 1620 570 1660 580 L 1695 600 Q 1715 625 1715 655 L 1710 685 Q 1700 710 1680 720 L 1650 727 Q 1615 725 1585 710 L 1570 690 Q 1565 665 1570 640 L 1577 615 Z', name: 'Southeast Asia'},
        
        // Japan
        {d: 'M 1840 360 Q 1865 355 1885 365 L 1895 385 Q 1900 415 1895 445 L 1885 470 Q 1870 485 1850 485 L 1830 480 Q 1815 465 1810 445 L 1807 415 Q 1810 385 1825 370 Z', name: 'Japan'},
        
        // Australia
        {d: 'M 1650 750 Q 1710 740 1770 750 L 1830 770 Q 1875 800 1890 845 L 1895 895 Q 1890 940 1870 975 L 1845 1000 Q 1810 1015 1770 1015 L 1710 1010 Q 1660 995 1625 970 L 1605 940 Q 1595 895 1600 850 L 1610 810 Q 1625 775 1645 760 Z', name: 'Australia'},
        
        // Greenland
        {d: 'M 650 100 Q 700 80 750 90 L 790 110 Q 810 140 810 175 L 805 210 Q 790 240 765 250 L 730 255 Q 685 250 650 235 L 630 210 Q 620 175 625 140 L 635 115 Z', name: 'Greenland'},
        
        // Antarctica (bottom)
        {d: 'M 100 950 L 1900 950 L 1900 1000 L 100 1000 Z', name: 'Antarctica', fill: 'rgba(200, 220, 240, 0.2)'},
    ];
    
    continents.forEach(continent => {
        const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElem.setAttribute('d', continent.d);
        pathElem.setAttribute('class', 'map-land');
        if (continent.fill) {
            pathElem.setAttribute('fill', continent.fill);
        }
        pathElem.setAttribute('data-name', continent.name);
        
        // Add title for accessibility and tooltip
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = continent.name;
        pathElem.appendChild(title);
        
        mapBg.appendChild(pathElem);
    });
    
    // Create timeline labels
    createTimelineLabels();
}

// Create timeline labels
function createTimelineLabels() {
    const labelsContainer = document.getElementById('timelineLabels');
    const milestones = [
        { year: -3000000, label: '3 Mya' },
        { year: -1000000, label: '1 Mya' },
        { year: -100000, label: '100 kya' },
        { year: -10000, label: '10k BCE' },
        { year: -3000, label: '3k BCE' },
        { year: 0, label: '0 CE' },
        { year: 1000, label: '1000' },
        { year: 2000, label: '2000' }
    ];
    
    milestones.forEach(milestone => {
        const position = yearToScroll(milestone.year);
        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = milestone.label;
        label.style.top = `${position * 100}%`;
        labelsContainer.appendChild(label);
    });
}

// Update visible inventions based on current time
function updateInventions(currentYear) {
    if (!dataLoaded) return;
    
    const dotsContainer = document.getElementById('inventionDots');
    dotsContainer.innerHTML = '';
    
    const visibleInventions = inventionsData.filter(inv => inv.date <= currentYear);
    
    visibleInventions.forEach((invention, index) => {
        const pos = latLngToSvg(invention.lat, invention.lng);
        
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'invention-dot');
        group.setAttribute('data-index', index);
        
        // Outer glow
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', pos.x);
        glow.setAttribute('cy', pos.y);
        glow.setAttribute('r', '12');
        
        // Inner core
        const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        core.setAttribute('class', 'dot-core');
        core.setAttribute('cx', pos.x);
        core.setAttribute('cy', pos.y);
        core.setAttribute('r', '4');
        
        group.appendChild(glow);
        group.appendChild(core);
        
        // Add hover events
        group.addEventListener('mouseenter', (e) => showTooltip(e, invention));
        group.addEventListener('mouseleave', hideTooltip);
        group.addEventListener('mousemove', (e) => moveTooltip(e));
        
        dotsContainer.appendChild(group);
        
        // Animate dot appearance
        setTimeout(() => {
            group.style.opacity = '1';
        }, index * 50);
    });
}

// Tooltip functions
function showTooltip(e, invention) {
    const tooltip = document.getElementById('tooltip');
    tooltip.querySelector('.tooltip-title').textContent = invention.name;
    tooltip.querySelector('.tooltip-date').textContent = formatDate(invention.date);
    tooltip.querySelector('.tooltip-location').textContent = invention.location;
    tooltip.querySelector('.tooltip-description').textContent = invention.description;
    tooltip.classList.add('visible');
    moveTooltip(e);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

function moveTooltip(e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${e.clientX + 20}px`;
    tooltip.style.top = `${e.clientY - 20}px`;
}

// Handle scroll
let ticking = false;
function handleScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const currentYear = scrollToYear(scrollPercent);
            
            // Update current date display
            document.getElementById('currentDate').textContent = formatDate(currentYear);
            
            // Update invention count
            const visibleCount = inventionsData.filter(inv => inv.date <= currentYear).length;
            document.getElementById('inventionCount').textContent = visibleCount;
            
            // Update timeline progress
            const progress = document.getElementById('timelineProgress');
            const marker = document.getElementById('timelineMarker');
            progress.style.height = `${scrollPercent * 100}%`;
            marker.style.top = `${scrollPercent * 100}%`;
            
            // Update inventions
            updateInventions(currentYear);
            
            ticking = false;
        });
        ticking = true;
    }
}

// Initialize
window.addEventListener('load', () => {
    loadInventions();
});

window.addEventListener('scroll', handleScroll);

// Smooth scroll hint
let hasScrolled = false;
window.addEventListener('scroll', () => {
    if (!hasScrolled) {
        hasScrolled = true;
        document.querySelector('.instructions').style.opacity = '0';
    }
});
