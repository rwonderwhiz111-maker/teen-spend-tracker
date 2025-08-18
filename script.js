/**
 * SpendZ - Gen Z Spend Tracker
 * A modern, colorful spend tracking application with localStorage persistence
 */

class SpendTracker {
    constructor() {
        this.spends = [];
        this.totalAmount = 0;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadSpends();
        this.bindEvents();
        this.renderSpends();
        this.updateTotal();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const form = document.getElementById('spendForm');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const filterCategory = document.getElementById('filterCategory');

        form.addEventListener('submit', (e) => this.handleAddSpend(e));
        clearAllBtn.addEventListener('click', () => this.clearAllSpends());
        filterCategory.addEventListener('change', (e) => this.filterSpends(e.target.value));

        // Quick amount buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                this.setQuickAmount(e.target);
            }
        });

        // Add click sound effects
        this.addSoundEffects();
    }

    /**
     * Handle form submission to add a new spend
     */
    handleAddSpend(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('spendName');
        const amountInput = document.getElementById('spendAmount');
        
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        // Validate inputs
        if (!name || isNaN(amount) || amount <= 0) {
            this.showToast('Please enter a valid name and amount! 🚫', 'error');
            return;
        }

        if (amount > 99999.99) {
            this.showToast('Amount too large! Keep it reasonable 💸', 'error');
            return;
        }

        // Create new spend object
        const newSpend = {
            id: Date.now() + Math.random(), // Unique ID
            name: name,
            amount: amount,
            emoji: this.getEmojiForSpend(name),
            timestamp: new Date().toISOString(),
            displayDate: this.formatDate(new Date())
        };

        // Add to spends array
        this.spends.unshift(newSpend); // Add to beginning for newest first
        this.saveSpends();
        this.renderSpends();
        this.updateTotal();

        // Clear form
        nameInput.value = '';
        amountInput.value = '';
        
        // Show success message and play sound
        this.showToast(`✓ Added "${name}" to your library for ₹${amount.toFixed(2)}`, 'success');
        this.playSuccessSound();
        
        // Clear quick button selection
        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Focus back on name input for quick entry
        nameInput.focus();
    }

    /**
     * Get appropriate emoji based on spend name/category
     */
    getEmojiForSpend(spendName) {
        const name = spendName.toLowerCase();
        
        // Food & Drinks
        if (name.includes('food') || name.includes('restaurant') || name.includes('lunch') || 
            name.includes('dinner') || name.includes('breakfast') || name.includes('meal') ||
            name.includes('pizza') || name.includes('burger') || name.includes('sushi') ||
            name.includes('taco') || name.includes('sandwich') || name.includes('snack')) {
            return '🍔';
        }
        
        if (name.includes('coffee') || name.includes('starbucks') || name.includes('cafe') ||
            name.includes('latte') || name.includes('cappuccino') || name.includes('tea') ||
            name.includes('drink') || name.includes('smoothie') || name.includes('juice')) {
            return '☕';
        }
        
        if (name.includes('beer') || name.includes('wine') || name.includes('alcohol') ||
            name.includes('bar') || name.includes('cocktail') || name.includes('vodka')) {
            return '🍷';
        }

        // Shopping & Fashion
        if (name.includes('clothes') || name.includes('shirt') || name.includes('pants') ||
            name.includes('dress') || name.includes('shoes') || name.includes('sneakers') ||
            name.includes('fashion') || name.includes('outfit') || name.includes('jacket') ||
            name.includes('jeans') || name.includes('hoodie') || name.includes('hat')) {
            return '👕';
        }
        
        if (name.includes('makeup') || name.includes('cosmetics') || name.includes('skincare') ||
            name.includes('beauty') || name.includes('perfume') || name.includes('lipstick') ||
            name.includes('foundation') || name.includes('mascara')) {
            return '💄';
        }

        // Technology & Gaming
        if (name.includes('game') || name.includes('gaming') || name.includes('xbox') ||
            name.includes('playstation') || name.includes('nintendo') || name.includes('steam') ||
            name.includes('fortnite') || name.includes('minecraft') || name.includes('console')) {
            return '🎮';
        }
        
        if (name.includes('phone') || name.includes('iphone') || name.includes('android') ||
            name.includes('laptop') || name.includes('computer') || name.includes('tech') ||
            name.includes('headphones') || name.includes('airpods') || name.includes('charger')) {
            return '📱';
        }

        // Entertainment & Media
        if (name.includes('movie') || name.includes('cinema') || name.includes('netflix') ||
            name.includes('spotify') || name.includes('subscription') || name.includes('streaming') ||
            name.includes('disney') || name.includes('hulu') || name.includes('youtube')) {
            return '🎬';
        }
        
        if (name.includes('music') || name.includes('concert') || name.includes('festival') ||
            name.includes('album') || name.includes('vinyl') || name.includes('headphones')) {
            return '🎵';
        }

        // Transportation
        if (name.includes('uber') || name.includes('lyft') || name.includes('taxi') ||
            name.includes('bus') || name.includes('train') || name.includes('metro') ||
            name.includes('transport') || name.includes('ride') || name.includes('gas') ||
            name.includes('fuel') || name.includes('car')) {
            return '🚗';
        }

        // Health & Fitness
        if (name.includes('gym') || name.includes('fitness') || name.includes('workout') ||
            name.includes('yoga') || name.includes('exercise') || name.includes('sports') ||
            name.includes('protein') || name.includes('supplement')) {
            return '💪';
        }

        // Education & Books
        if (name.includes('book') || name.includes('education') || name.includes('course') ||
            name.includes('school') || name.includes('university') || name.includes('tuition') ||
            name.includes('textbook') || name.includes('study')) {
            return '📚';
        }

        // Home & Living
        if (name.includes('rent') || name.includes('apartment') || name.includes('home') ||
            name.includes('furniture') || name.includes('decor') || name.includes('plants') ||
            name.includes('candle') || name.includes('room')) {
            return '🏠';
        }

        // Gifts & Social
        if (name.includes('gift') || name.includes('present') || name.includes('birthday') ||
            name.includes('anniversary') || name.includes('valentine') || name.includes('christmas')) {
            return '🎁';
        }

        // Default emoji for uncategorized spends
        return '💸';
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Delete a specific spend
     */
    deleteSpend(spendId) {
        const spendIndex = this.spends.findIndex(spend => spend.id === spendId);
        if (spendIndex > -1) {
            const deletedSpend = this.spends[spendIndex];
            this.spends.splice(spendIndex, 1);
            this.saveSpends();
            this.renderSpends();
            this.updateTotal();
            this.showToast(`⚡ Removed "${deletedSpend.name}" from library`, 'success');
        }
    }

    /**
     * Clear all spends with confirmation
     */
    clearAllSpends() {
        if (this.spends.length === 0) return;

        if (confirm('Are you sure you want to delete ALL spends? This cannot be undone! 😱')) {
            this.spends = [];
            this.saveSpends();
            this.renderSpends();
            this.updateTotal();
            this.showToast('🗑️ Library cleared - Ready for new content!', 'success');
        }
    }

    /**
     * Render all spends to the DOM
     */
    renderSpends() {
        const spendsList = document.getElementById('spendsList');
        const clearAllBtn = document.getElementById('clearAllBtn');

        if (this.spends.length === 0) {
            spendsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-emoji">💸</div>
                    <h3 class="empty-title">No spends yet!</h3>
                    <p class="empty-text">Add your first spend above to get started ✨</p>
                </div>
            `;
            clearAllBtn.style.display = 'none';
            return;
        }

        clearAllBtn.style.display = 'block';

        const spendsHTML = this.spends.map(spend => `
            <div class="spend-item" data-id="${spend.id}">
                <div class="spend-info">
                    <div class="spend-emoji">${spend.emoji}</div>
                    <div class="spend-details">
                        <div class="spend-name">${this.escapeHtml(spend.name)}</div>
                        <div class="spend-timestamp">${spend.displayDate}</div>
                    </div>
                </div>
                <div class="spend-amount">₹${spend.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="spendTracker.deleteSpend(${spend.id})" 
                        title="Delete this spend">
                    🗑️
                </button>
            </div>
        `).join('');

        spendsList.innerHTML = spendsHTML;
    }

    /**
     * Update total amount display and statistics
     */
    updateTotal() {
        this.totalAmount = this.spends.reduce((sum, spend) => sum + spend.amount, 0);
        const totalElement = document.getElementById('totalAmount');
        totalElement.textContent = `₹${this.totalAmount.toFixed(2)}`;
        
        // Update statistics
        this.updateStatistics();
        
        // Add animation class for visual feedback
        totalElement.classList.add('updated');
        setTimeout(() => totalElement.classList.remove('updated'), 300);
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const totalTransactions = document.getElementById('totalTransactions');
        const avgSpend = document.getElementById('avgSpend');
        const monthlySpend = document.getElementById('monthlySpend');

        const transactionCount = this.spends.length;
        const averageSpend = transactionCount > 0 ? this.totalAmount / transactionCount : 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthSpends = this.spends.filter(spend => {
            const spendDate = new Date(spend.timestamp);
            return spendDate.getMonth() === currentMonth && spendDate.getFullYear() === currentYear;
        });
        const monthlyTotal = thisMonthSpends.reduce((sum, spend) => sum + spend.amount, 0);

        totalTransactions.textContent = transactionCount;
        avgSpend.textContent = `₹${averageSpend.toFixed(0)}`;
        monthlySpend.textContent = `₹${monthlyTotal.toFixed(0)}`;
    }

    /**
     * Save spends to localStorage
     */
    saveSpends() {
        try {
            localStorage.setItem('spendz_spends', JSON.stringify(this.spends));
        } catch (error) {
            console.error('Failed to save spends:', error);
            this.showToast('Failed to save data! 😞', 'error');
        }
    }

    /**
     * Load spends from localStorage
     */
    loadSpends() {
        try {
            const savedSpends = localStorage.getItem('spendz_spends');
            if (savedSpends) {
                this.spends = JSON.parse(savedSpends);
                // Update display dates for existing spends
                this.spends.forEach(spend => {
                    spend.displayDate = this.formatDate(new Date(spend.timestamp));
                });
            }
        } catch (error) {
            console.error('Failed to load spends:', error);
            this.spends = [];
            this.showToast('Failed to load saved data! 😞', 'error');
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Change toast color based on type
        if (type === 'error') {
            toast.style.background = 'var(--danger-gradient)';
        } else {
            toast.style.background = 'var(--success-gradient)';
        }
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Set quick amount from button
     */
    setQuickAmount(button) {
        const amount = button.dataset.amount;
        const amountInput = document.getElementById('spendAmount');
        
        // Remove selected class from all quick buttons
        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked button
        button.classList.add('selected');
        
        // Set the amount
        amountInput.value = amount;
        amountInput.focus();
        
        // Play click sound effect
        this.playClickSound();
    }

    /**
     * Filter spends by category
     */
    filterSpends(category) {
        const spendItems = document.querySelectorAll('.spend-item');
        
        spendItems.forEach(item => {
            if (category === 'all') {
                item.style.display = 'flex';
                item.style.animation = 'slideInUp 0.3s ease-out';
            } else {
                const emoji = item.querySelector('.spend-emoji').textContent;
                if (this.getCategoryEmoji(category) === emoji || category === emoji) {
                    item.style.display = 'flex';
                    item.style.animation = 'slideInUp 0.3s ease-out';
                } else {
                    item.style.display = 'none';
                }
            }
        });
        
        this.playClickSound();
    }

    /**
     * Get main category emoji for filtering
     */
    getCategoryEmoji(category) {
        const categoryMap = {
            '🍔': ['🍔', '☕', '🍷'],
            '👕': ['👕', '💄'],
            '🎮': ['🎮', '📱'],
            '🚗': ['🚗'],
            '🎬': ['🎬', '🎵'],
            '💸': ['💸', '🎁', '🏠', '📚', '💪']
        };
        
        for (const [main, emojis] of Object.entries(categoryMap)) {
            if (emojis.includes(category)) return main;
        }
        return category;
    }

    /**
     * Add sound effects to interactions
     */
    addSoundEffects() {
        // Create audio context for sound effects
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    /**
     * Play click sound effect
     */
    playClickSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            // Sound effects not critical, continue silently
        }
    }

    /**
     * Play success sound effect
     */
    playSuccessSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            // Sound effects not critical, continue silently
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.spendTracker = new SpendTracker();
});

// Add CSS animation class for total update
const style = document.createElement('style');
style.textContent = `
    .total-amount.updated {
        animation: totalUpdate 0.3s ease-out;
    }
    
    @keyframes totalUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
