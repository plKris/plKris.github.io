document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.project-section');
            const progressBar = document.querySelector('.progress-bar');
            let currentSection = 0;
            let isScrolling = false;
            const projectControls = document.querySelectorAll('[data-project-direction]');
            
            updateProgressBar();
            
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
            
            window.addEventListener('keydown', function(e) {
                if (!['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(e.key)) return;
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
            
            projectControls.forEach(function(control) {
                control.addEventListener('click', function() {
                    if (control.dataset.projectDirection === 'next') {
                        navigateToNext();
                    } else {
                        navigateToPrev();
                    }
                });
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