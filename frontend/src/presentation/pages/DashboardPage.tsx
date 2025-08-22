import React, { useEffect } from 'react';
import AgeRangeChart from '../components/charts/AgeRangeChart';
import '../components/charts/Charts.css';
import MonthlyRegistrationsChart from '../components/charts/MonthlyRegistrationsChart';
import ProfessionChart from '../components/charts/ProfessionChart';
import Loading from '../components/common/Loading';
import { usePersonStats } from '../hooks/usePersonStats';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { stats, isLoading, error, loadStats, refreshStats } = usePersonStats();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRefresh = () => {
    refreshStats();
  };

  if (isLoading && !stats) {
    return <Loading fullScreen text="Cargando estadísticas..." />;
  }

  if (error && !stats) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <h2>Error al cargar estadísticas</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <div className="no-data-container">
          <h2>No hay datos disponibles</h2>
          <p>Registre algunas personas para ver las estadísticas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard de Estadísticas</h1>
        <div className="header-actions">
          <button 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="refresh-button"
          >
            {isLoading ? 'Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value">{stats.total_persons}</div>
          <div className="stat-label">Total de Personas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Object.keys(stats.professions_count).length}
          </div>
          <div className="stat-label">Profesiones Diferentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Object.keys(stats.monthly_registrations).length}
          </div>
          <div className="stat-label">Meses con Registros</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-item">
          <ProfessionChart 
            data={stats.professions_count}
            title="Distribución por Profesión"
          />
        </div>

        <div className="chart-item">
          <AgeRangeChart 
            data={stats.age_ranges}
            title="Distribución por Rangos de Edad"
          />
        </div>

        <div className="chart-item full-width">
          <MonthlyRegistrationsChart 
            data={stats.monthly_registrations}
            title="Evolución de Registros por Mes"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
