// Minimal interactivity for OOCL HUB
document.addEventListener('DOMContentLoaded', () => {
    // Add hover sound or subtle effects if needed
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Potential for sound effects or additional haptic-visual feedback
        });
    });

    // Handle smooth entry of the hero text
    const hero = document.querySelector('.hero');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        hero.style.transition = 'all 0.8s ease-out';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
});
