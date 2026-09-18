import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace this with your real Mapbox token from https://account.mapbox.com/
// You can also set VITE_MAPBOX_TOKEN in your .env file
const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiZGFydWthYS1lYXJ0aCIsImEiOiJjbHAxMjM0NTYifQ.placeholder';

mapboxgl.accessToken = MAPBOX_TOKEN;

function computeArea(coords) {
  // Shoelace formula — rough planar approximation for small polygons
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    // Convert degrees to meters (~111,320 m per degree latitude)
    area += x1 * 111320 * (y2 * 110540) - x2 * 111320 * (y1 * 110540);
  }
  return Math.abs(area / 2);
}

export const MapDraw = ({
  onPolygonDrawn,
  initialCenter = [77.5946, 12.9716], // default: Bengaluru, India
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: initialCenter,
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'simple_select',
    });

    map.current.addControl(draw.current, 'top-left');

    function onDrawChange() {
      if (!draw.current) return;
      const data = draw.current.getAll();
      if (!data.features.length) return;
      const feature = data.features[data.features.length - 1];
      if (feature.geometry.type !== 'Polygon') return;
      const polygon = feature.geometry;
      const area = computeArea(polygon.coordinates[0]);
      onPolygonDrawn(polygon, area);
    }

    map.current.on('draw.create', onDrawChange);
    map.current.on('draw.update', onDrawChange);

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}
    >
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)',
          color: '#fff',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        🖊 Click the polygon tool on the left to draw a site boundary
      </div>
    </div>
  );
};
