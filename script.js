class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.links = document.querySelectorAll('a, button, .btn');
        
        this.init();
    }
    
    init() {
        this.cursor.style.opacity = '1';
        this.follower.style.opacity = '1';
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                this.follower.style.left = e.clientX + 'px';
                this.follower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.follower.style.transform = 'scale(1.5)';
                this.follower.style.opacity = '0.8';
            });
            
            link.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.follower.style.transform = 'scale(1)';
                this.follower.style.opacity = '0.5';
            });
        });
    }
}

// Three.js 3D Scene
class ThreeScene {
    constructor() {
        this.container = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        this.createParticles();
        this.createGeometry();
        this.addLights();
        this.animate();
        this.addEventListeners();
    }
    
    createParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
            
            colors[i] = Math.random();
            colors[i + 1] = Math.random() * 0.5 + 0.5;
            colors[i + 2] = 1;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createGeometry() {
        // Floating geometric shapes
        const shapes = [];
        
        // Torus
        const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
        const torusMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(-3, 2, -2);
        shapes.push(torus);
        
        // Icosahedron
        const icoGeometry = new THREE.IcosahedronGeometry(0.8, 0);
        const icoMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0080,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(3, -1, -1);
        shapes.push(icosahedron);
        
        // Octahedron
        const octaGeometry = new THREE.OctahedronGeometry(1, 0);
        const octaMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
        octahedron.position.set(0, -2, -3);
        shapes.push(octahedron);
        
        shapes.forEach(shape => {
            this.scene.add(shape);
        });
        
        this.shapes = shapes;
    }
    
    addLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff0080, 1, 100);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particles
        this.particles.rotation.x += 0.001;
        this.particles.rotation.y += 0.002;
        
        // Animate shapes
        if (this.shapes) {
            this.shapes.forEach((shape, index) => {
                shape.rotation.x += 0.01 + index * 0.002;
                shape.rotation.y += 0.01 + index * 0.001;
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });
        }
        
        // Mouse interaction
        this.camera.position.x += (this.mouseX * 0.05 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.05 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            this.mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        });
    }
}

// Smooth scrolling and navigation
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.addScrollEffect();
        this.addSmoothScrolling();
        this.addActiveNavigation();
    }
    
    addScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }
    
    addSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    addActiveNavigation() {
        window.addEventListener('scroll', () => {
            let current = '';
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Skill progress animation
class SkillsAnimation {
    constructor() {
        this.skillsSection = document.getElementById('skills');
        this.progressBars = document.querySelectorAll('.progress-bar');
        this.animated = false;
        
        this.init();
    }
    
    init() {
        this.observeSkillsSection();
    }
    
    observeSkillsSection() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateSkills();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.skillsSection);
    }
    
    animateSkills() {
        this.progressBars.forEach(bar => {
            const skill = bar.getAttribute('data-skill');
            setTimeout(() => {
                bar.style.width = skill + '%';
            }, 200);
        });
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.stat-item, .skill-card, .project-card');
        this.init();
    }
    
    init() {
        this.observeElements();
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// Particle cursor trail
class ParticleTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9997';
        particle.style.opacity = '0.8';
        particle.style.transition = 'all 0.5s ease-out';
        
        document.body.appendChild(particle);
        
        this.particles.push({
            element: particle,
            life: 1
        });
        
        if (this.particles.length > this.maxParticles) {
            const oldParticle = this.particles.shift();
            oldParticle.element.remove();
        }
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.element.style.opacity = particle.life;
            particle.element.style.transform = `scale(${particle.life})`;
            
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if on mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        new CustomCursor();
        new ParticleTrail();
    }
    
    new ThreeScene();
    new Navigation();
    new SkillsAnimation();
    new ScrollAnimations();
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // Parallax effect for floating cards
    window.addEventListener('scroll', () => {
        const cards = document.querySelectorAll('.floating-card');
        const scrolled = window.pageYOffset;
        
        cards.forEach((card, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            card.style.transform = `translateY(${rate}px)`;
        });
    });
});