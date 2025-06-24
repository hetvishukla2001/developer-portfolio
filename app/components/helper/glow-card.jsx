import { useEffect } from 'react';

const GlowCard = ({ children, identifier }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const CONTAINER = document.querySelector(`.glow-container-${identifier}`);
    const CARDS = document.querySelectorAll(`.glow-card-${identifier}`);

    if (!CONTAINER || CARDS.length === 0) return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const UPDATE = (event) => {
      for (const CARD of CARDS) {
        const rect = CARD.getBoundingClientRect();
        const inProximity =
          event?.x > rect.left - CONFIG.proximity &&
          event?.x < rect.left + rect.width + CONFIG.proximity &&
          event?.y > rect.top - CONFIG.proximity &&
          event?.y < rect.top + rect.height + CONFIG.proximity;

        CARD.style.setProperty('--active', inProximity ? 1 : CONFIG.opacity);

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let angle =
          (Math.atan2(event.y - centerY, event.x - centerX) * 180) / Math.PI;
        if (angle < 0) angle += 360;

        CARD.style.setProperty('--start', angle + 90);
      }
    };

    const RESTYLE = () => {
      CONTAINER.style.setProperty('--gap', CONFIG.gap);
      CONTAINER.style.setProperty('--blur', CONFIG.blur);
      CONTAINER.style.setProperty('--spread', CONFIG.spread);
      CONTAINER.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
    };

    RESTYLE();
    document.body.addEventListener('pointermove', UPDATE);

    return () => {
      document.body.removeEventListener('pointermove', UPDATE);
    };
  }, [identifier]);

  return (
    <div className={`glow-container-${identifier} glow-container`}>
      <article className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}>
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
