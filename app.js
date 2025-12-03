// Data & State
const checklistItems = [
    "Vehicle Documents (DL, RC, Insurance)",
    "Sunscreen & Wide Hat (Bijapur sun)",
    "Comfortable Walking Shoes (Monuments)",
    "Cash (Small notes for tolls/coconuts)",
    "Portable Power Bank",
    "Reusable Water Bottles",
    "Basic First Aid Kit",
    "Offline Maps (Network can be spotty)",
    "Sunglasses & Scarf",
    "Snacks (Dry fruits/Chips)"
];

// DOM Elements
const checklistContainer = document.getElementById('checklist-container');
const hotelInput = document.getElementById('hotelPrice');
const hotelDisplay = document.getElementById('hotelDisplay');
const mileageInput = document.getElementById('mileage');
const mileageVal = document.getElementById('mileageVal');
const fuelPriceInput = document.getElementById('fuelPrice');
const fuelVal = document.getElementById('fuelVal');
const totalCostDisplay = document.getElementById('totalCost');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// 1. Checklist Logic
function renderChecklist() {
    checklistContainer.innerHTML = '';
    const savedState = JSON.parse(localStorage.getItem('tripChecklist')) || {};
    
    checklistItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'relative group cursor-pointer';
        
        const isChecked = savedState[index] ? 'checked' : '';
        
        div.innerHTML = `
            <label class="flex items-center p-5 hover:bg-pastel-blue/20 transition-colors duration-200 cursor-pointer">
                <input type="checkbox" id="item-${index}" class="custom-checkbox w-6 h-6 rounded-full border-2 border-stone-300 text-teal-500 focus:ring-teal-200 focus:ring-offset-0 cursor-pointer transition" ${isChecked}>
                <div class="ml-4 flex-1">
                    <span class="text-stone-700 font-medium text-lg transition-all duration-300 ${isChecked ? 'line-through text-stone-400' : ''}">${item}</span>
                </div>
            </label>
        `;
        
        // Event Listeners
        const checkbox = div.querySelector('input');
        const span = div.querySelector('span');

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                span.classList.add('line-through', 'text-stone-400');
            } else {
                span.classList.remove('line-through', 'text-stone-400');
            }
            toggleItem(index, e.target.checked);
        });

        checklistContainer.appendChild(div);
    });
}

function toggleItem(index, isChecked) {
    const savedState = JSON.parse(localStorage.getItem('tripChecklist')) || {};
    if (isChecked) {
        savedState[index] = true;
    } else {
        delete savedState[index];
    }
    localStorage.setItem('tripChecklist', JSON.stringify(savedState));
}

document.getElementById('reset-checklist').addEventListener('click', () => {
    if(confirm("Start fresh? This will uncheck everything.")) {
        localStorage.removeItem('tripChecklist');
        renderChecklist();
    }
});

// 2. Cost Calculator Logic
function calculateCost() {
    const distance = 550; // Fixed total km
    const hotelCostPerNight = parseInt(hotelInput.value);
    const nights = 2;
    const mileage = parseFloat(mileageInput.value) || 15;
    const fuelPrice = parseFloat(fuelPriceInput.value) || 105;
    const buffer = 3000; // Food + Tickets

    const fuelCost = (distance / mileage) * fuelPrice;
    const totalHotel = hotelCostPerNight * nights;
    const total = fuelCost + totalHotel + buffer;

    // Update Display Values
    hotelDisplay.textContent = `₹${hotelCostPerNight}`;
    mileageVal.textContent = mileage;
    fuelVal.textContent = fuelPrice;
    
    // Animate Number
    animateValue(totalCostDisplay, parseInt(totalCostDisplay.textContent.replace(/[^\d]/g, '')) || 0, Math.round(total), 500);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.textContent = `₹${currentVal.toLocaleString('en-IN')}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

[hotelInput, mileageInput, fuelPriceInput].forEach(input => {
    input.addEventListener('input', calculateCost);
});

// 3. Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// 4. Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Initialize
renderChecklist();
calculateCost();
