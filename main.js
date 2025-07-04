// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = [
        {
            quote: "DevOps Africa transformed my career. After completing the Ethical Hacking course, I landed a job as a security analyst.",
            name: "Amina Bello",
            role: "Security Analyst, Lagos",
            image: "/images/testimonial1.jpg"
        },
        {
            quote: "The Cloud Security course gave me the skills I needed to secure our company's infrastructure. Highly recommended!",
            name: "Kwame Osei",
            role: "DevOps Engineer, Accra",
            image: "/images/testimonial2.jpg"
        },
        {
            quote: "As a beginner, the introductory courses made complex concepts easy to understand. The community support is amazing.",
            name: "Naledi Modise",
            role: "IT Student, Johannesburg",
            image: "/images/testimonial3.jpg"
        }
    ];

    const testimonialContainer = document.querySelector('.testimonial-slider');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialContainer.innerHTML = `
            <div class="testimonial active">
                <p>"${testimonials[index].quote}"</p>
                <div class="author">
                    <img src="${testimonials[index].image}" alt="${testimonials[index].name}">
                    <div>
                        <h4>${testimonials[index].name}</h4>
                        <span>${testimonials[index].role}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Show first testimonial
    showTestimonial(currentTestimonial);

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Course filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter courses
                const courses = document.querySelectorAll('.course-card');
                courses.forEach(course => {
                    if (filterValue === 'all' || course.classList.contains(filterValue)) {
                        course.style.display = 'block';
                    } else {
                        course.style.display = 'none';
                    }
                });
            });
        });
    }
});
