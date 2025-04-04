import { useState, useEffect } from 'react';

function Home() {
  const carouselImages = [
    'https://images.unsplash.com/photo-1519494026892-80cea0757f05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80', 
    'https://images.unsplash.com/photo-1579684453423-8e19299b0b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80', 
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80',
  ];

  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  const specializations = [
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Neurology', icon: '🧠' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Orthopedics', icon: '🦴' },
    { name: 'Dermatology', icon: '🩺' },
    { name: 'General Medicine', icon: '💊' },
  ];

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.carousel}>
          {carouselImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Healthcare Slide ${index + 1}`}
              style={{
                ...styles.carouselImage,
                opacity: index === currentImage ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
              onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80')} // Fallback
            />
          ))}
          <button style={{ ...styles.carouselButton, left: '20px' }} onClick={prevImage}>
            ❮
          </button>
          <button style={{ ...styles.carouselButton, right: '20px' }} onClick={nextImage}>
            ❯
          </button>
        </div>
        <div style={styles.heroText}>
          <h1 style={styles.title}>Welcome To MedCorx</h1>
          <p style={styles.subtitle}>
            Your trusted platform for seamless medical appointments.
          </p>
          <a href="/register" style={styles.ctaButton}>Get Started</a>
        </div>
      </section>

      
      <section style={styles.about}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <div style={styles.aboutContent}>
          <div style={styles.aboutText}>
            <p>
              At MedCorx, we revolutionize how you connect with medical
              professionals. Our platform empowers patients to book appointments effortlessly,
              doctors to manage their schedules, and admins to oversee operations with ease.
            </p>
            <p>
              With a commitment to quality care and cutting-edge technology, we ensure your
              healthcare experience is smooth, secure, and stress-free.
            </p>
          </div>
          <div style={styles.features}>
            <h3 style={styles.featureTitle}>Why Choose Us?</h3>
            <ul style={styles.featureList}>
              <li>Instant appointment booking</li>
              <li>Verified healthcare professionals</li>
              <li>Easy schedule management</li>
              <li>Secure and confidential</li>
            </ul>
          </div>
        </div>
      </section>
      <section style={styles.specializations}>
        <h2 style={styles.sectionTitle}>Available Specializations</h2>
        <div style={styles.specializationGrid}>
          {specializations.map((spec, index) => (
            <div key={index} style={styles.specializationCard}>
              <span style={styles.specializationIcon}>{spec.icon}</span>
              <h3 style={styles.specializationName}>{spec.name}</h3>
            </div>
          ))}
        </div>
      </section>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>MedCorx - Your Handy Healthcare Booking System</h4>
            <p>Simplifying healthcare, one appointment at a time.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <ul style={styles.footerLinks}>
              <li><a href="/" style={styles.footerLink}>Home</a></li>
              <li><a href="/doctors" style={styles.footerLink}>Doctors</a></li>
              <li><a href="/register" style={styles.footerLink}>Register</a></li>
              <li><a href="/login" style={styles.footerLink}>Login</a></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Contact Us</h4>
            <p>Email: support@MedCorx.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: Bangalore,India</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 MedCorx Private Limited. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    margin: 0,
    padding: 0,
  },
  hero: {
    position: 'relative',
    height: '70vh',
    overflow: 'hidden',
  },
  carousel: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    padding: '15px',
    cursor: 'pointer',
    fontSize: '24px',
    zIndex: 2,
    borderRadius: '50%',
  },
  heroText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
    zIndex: 3,
  },
  title: {
    fontSize: '3.5rem',
    margin: '0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.8rem',
    margin: '15px 0 25px',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 25px',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.3rem',
    transition: 'background 0.3s',
  },
  about: {
    padding: '60px 20px',
    background: '#f9f9f9',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    color: '#007bff',
    marginBottom: '30px',
    fontWeight: '600',
  },
  aboutContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  aboutText: {
    flex: '1 1 50%',
    padding: '20px',
    textAlign: 'left',
    fontSize: '1.2rem',
    lineHeight: '1.7',
  },
  features: {
    flex: '1 1 40%',
    padding: '20px',
    textAlign: 'left',
  },
  featureTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  featureList: {
    listStyle: 'none',
    padding: '0',
    fontSize: '1.2rem',
    lineHeight: '2',
  },
  specializations: {
    padding: '60px 20px',
    background: '#fff',
    textAlign: 'center',
  },
  specializationGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
  },
  specializationCard: {
    background: '#f0f8ff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  specializationIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  specializationName: {
    fontSize: '1.3rem',
    color: '#007bff',
    margin: '0',
  },
  footer: {
    background: '#2c3e50',
    color: 'white',
    padding: '40px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footerSection: {
    flex: '1 1 300px',
    padding: '20px',
  },
  footerTitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
  },
  footerLinks: {
    listStyle: 'none',
    padding: '0',
  },
  footerLink: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '1.1rem',
    lineHeight: '1.8',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #444',
    marginTop: '20px',
    fontSize: '0.9rem',
  },
};

export default Home;