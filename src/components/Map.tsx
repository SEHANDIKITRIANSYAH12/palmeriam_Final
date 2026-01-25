"use client";

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507673.4756900292!2d106.12905640624996!3d-6.237477388236575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f46491cff6cf%3A0x66877b538da35681!2sPalmeriam%2C%20Kec.%20Matraman%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1769099821774!5m2!1sid!2sid"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Kelurahan Palmeriam"
        className="w-full h-full"
      />
    </div>
  );
};

export default Map;
