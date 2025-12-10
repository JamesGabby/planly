// components/floating-particles.tsx
export function FloatingParticles() {
  // Use predetermined positions instead of random
  const particles = [
    { left: "5%", top: "10%", delay: "0s", duration: "4s" },
    { left: "15%", top: "25%", delay: "0.5s", duration: "5s" },
    { left: "25%", top: "5%", delay: "1s", duration: "6s" },
    { left: "35%", top: "45%", delay: "1.5s", duration: "4.5s" },
    { left: "45%", top: "15%", delay: "2s", duration: "5.5s" },
    { left: "55%", top: "35%", delay: "2.5s", duration: "4s" },
    { left: "65%", top: "55%", delay: "3s", duration: "6.5s" },
    { left: "75%", top: "20%", delay: "3.5s", duration: "5s" },
    { left: "85%", top: "40%", delay: "4s", duration: "4.5s" },
    { left: "95%", top: "60%", delay: "4.5s", duration: "5.5s" },
    { left: "10%", top: "70%", delay: "0.3s", duration: "6s" },
    { left: "20%", top: "85%", delay: "0.8s", duration: "4s" },
    { left: "30%", top: "65%", delay: "1.3s", duration: "5s" },
    { left: "40%", top: "80%", delay: "1.8s", duration: "5.5s" },
    { left: "50%", top: "90%", delay: "2.3s", duration: "4.5s" },
    { left: "60%", top: "75%", delay: "2.8s", duration: "6s" },
    { left: "70%", top: "95%", delay: "3.3s", duration: "4s" },
    { left: "80%", top: "70%", delay: "3.8s", duration: "5s" },
    { left: "90%", top: "85%", delay: "4.3s", duration: "5.5s" },
    { left: "3%", top: "50%", delay: "4.8s", duration: "6s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}