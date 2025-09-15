document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.project-section');
            const progressBar = document.querySelector('.progress-bar');
            let currentSection = 0;
            let isScrolling = false;
            let touchStartY = 0;
            
            // Initialisation
            updateProgressBar();
            
            // Gestion du scroll à la souris
            window.addEventListener('wheel', function(e) {
                if (isScrolling) return;
                
                isScrolling = true;
                
                if (e.deltaY > 0) {
                    navigateToNext();
                } else {
                    navigateToPrev();
                }
                
                setTimeout(function() {
                    isScrolling = false;
                }, 1000);
            });
            
            // Navigation au clavier
            window.addEventListener('keydown', function(e) {
                if (isScrolling) return;
                
                isScrolling = true;
                
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    navigateToNext();
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    navigateToPrev();
                }
                
                setTimeout(function() {
                    isScrolling = false;
                }, 1000);
            });
            
            // Navigation tactile pour mobiles
            window.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            });
            
            window.addEventListener('touchend', function(e) {
                if (isScrolling) return;
                
                const touchEndY = e.changedTouches[0].screenY;
                const diffY = touchEndY - touchStartY;
                
                if (Math.abs(diffY) < 50) return;
                
                isScrolling = true;
                
                if (diffY < 0) {
                    navigateToNext();
                } else {
                    navigateToPrev();
                }
                
                setTimeout(function() {
                    isScrolling = false;
                }, 1000);
            });
            
            function navigateToNext() {
                if (currentSection < sections.length - 1) {
                    sections[currentSection].classList.remove('active');
                    currentSection++;
                    sections[currentSection].classList.add('active');
                    updateProgressBar();
                }
            }
            
            function navigateToPrev() {
                if (currentSection > 0) {
                    sections[currentSection].classList.remove('active');
                    currentSection--;
                    sections[currentSection].classList.add('active');
                    updateProgressBar();
                }
            }
            
            function updateProgressBar() {
                const progress = ((currentSection + 1) / sections.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
        });