import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Spider Chart - Wykres pająka dla danych BBT
 * Prosta implementacja bez zewnętrznych bibliotek
 */
export const SpiderChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Wyczyść canvas
    ctx.clearRect(0, 0, width, height);

    const { labels, datasets } = data;
    const numPoints = labels.length;
    const angleStep = (2 * Math.PI) / numPoints;

    // Rysuj siatkę
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;

    // Koncentryczne okręgi
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Linie promieniowe
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Etykiety
    ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      // Skróć długie etykiety
      const label = labels[i].length > 12 ? labels[i].substring(0, 12) + '...' : labels[i];
      ctx.fillText(label, x, y);
    }

    // Rysuj dane
    datasets.forEach((dataset, datasetIndex) => {
      const { data: values, borderColor, backgroundColor } = dataset;
      const maxValue = Math.max(...values.map(Math.abs));
      
      ctx.strokeStyle = borderColor;
      ctx.fillStyle = backgroundColor;
      ctx.lineWidth = 2;

      // Ścieżka danych
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = Math.abs(values[i]);
        const normalizedValue = maxValue > 0 ? (value / maxValue) : 0;
        const pointRadius = radius * normalizedValue * 0.8;
        
        const x = centerX + Math.cos(angle) * pointRadius;
        const y = centerY + Math.sin(angle) * pointRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Wypełnienie
      ctx.globalAlpha = 0.3;
      ctx.fill();
      
      // Obramowanie
      ctx.globalAlpha = 1;
      ctx.stroke();

      // Punkty danych
      ctx.fillStyle = borderColor;
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = Math.abs(values[i]);
        const normalizedValue = maxValue > 0 ? (value / maxValue) : 0;
        const pointRadius = radius * normalizedValue * 0.8;
        
        const x = centerX + Math.cos(angle) * pointRadius;
        const y = centerY + Math.sin(angle) * pointRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Legenda
    const legendY = height - 20;
    let legendX = 20;
    
    datasets.forEach((dataset) => {
      ctx.fillStyle = dataset.borderColor;
      ctx.fillRect(legendX, legendY - 5, 10, 10);
      
      ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(dataset.label, legendX + 15, legendY);
      
      legendX += ctx.measureText(dataset.label).width + 40;
    });

  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        Brak danych do wyświetlenia
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={280}
        height={200}
        className="w-full h-auto"
        style={{ maxHeight: '200px' }}
      />
    </div>
  );
};

SpiderChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      borderColor: PropTypes.string.isRequired,
      backgroundColor: PropTypes.string.isRequired,
    })).isRequired,
  }),
};
